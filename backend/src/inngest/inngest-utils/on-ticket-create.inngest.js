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
        } catch (error) {
            console.error(`❌ Error running ticket steps(pipeline) ${error}`);
            return { success: false };
        }
    },
);
