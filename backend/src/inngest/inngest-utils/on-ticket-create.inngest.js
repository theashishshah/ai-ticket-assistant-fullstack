import inngest from "../client.js";
import analyzeTicket from "../../utils/ai.util.js";
import User from "../../models/user.model.js";
import { Ticket } from "../../models/ticket.model.js";
import { NonRetriableError } from "inngest";

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
        } catch (error) {
            console.error(`❌ Error running ticket steps(pipeline) ${error}`);
            return { success: false };
        }
    },
);
