import inngest from "../client.js";
import analyzeTicket from "../../utils/ai.util.js";
import User from "../../models/user.model.js";
import { Ticket } from "../../models/ticket.model.js";
import { NonRetriableError } from "inngest";
import sendMail from "../../utils/mailer.util.js";

export const onTicketCreated = inngest.createFunction(
    { id: "on-ticket-creation", retries: 2 },
    { event: "ti" },
    async ({ event, step }) => {
        try {
            const { ticketId } = event.data;

            const ticket = await step.run("find-ticket", async () => {
                const ticketObject = await Ticket.findById({ ticketId });
                if (!ticketObject) {
                    throw NonRetriableError("Ticket not found.");
                }
                return ticketObject;
            });
            await step.run("update-ticket-status", async () => {
                await Ticket.findByIdAndUpdate(ticket._id, { status: "To-do" });
            });

            const aiResponse = await analyzeTicket(ticket);

            //TODO: logg ai response to see what you're getting from ai
            // grad the related skills from the   ai response
            const relatedSkills = await step.run("ai-processing", async () => {
                let skills = [];
                if (aiResponse) {
                    await Ticket.findByIdAndUpdate(ticket._id, {
                        priority: !["high", "low", "medium"].includes(aiResponse.priority)
                            ? "medium"
                            : aiResponse.priority,
                        shortNotes: aiResponse.helpfulNotes,
                        status: "In-progess",
                        relatedSkills: aiResponse.relatedSkills,
                    });
                    skills = aiResponse.relatedSkills;
                }
                return skills;
            });

            // if skilss matches then assign the moderator if moderator exist in db
            const assignedModerator = await step.run("assign-moderator", async () => {
                let user = await User.findOne({
                    role: "moderator",
                    skills: {
                        $elemMatch: {
                            $regex: relatedSkills.join("|"),
                            $options: "i",
                        },
                    },
                });

                if (!user) {
                    user = await User.findOne({
                        role: "admin",
                    });
                }
                await Ticket.findByIdAndUpdate(ticket._id, {
                    assignedTo: user?._id || null,
                });
                return user;
            });

            await step.run("send-email-notification", async () => {
                // find the  moderator and send the notifiation to him
                if (assignedModerator) {
                    const updatedTicket = await Ticket.findById(ticket._id);
                    await sendMail(
                        assignedModerator.email,
                        "Ticket assigned",
                        `A new ticket assigned to you ${updatedTicket.title}`,
                    );
                }
            });

            return { success: true };
        } catch (error) {
            console.error(`❌ Error running ticket steps(pipeline) ${error}`);
            return { success: false };
        }
    },
);
