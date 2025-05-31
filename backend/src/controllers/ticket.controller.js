import { Ticket } from "../models/ticket.model.js";
import { inngest } from "../inngest/client.js";
export const createTicket = async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({
            success: false,
            message: "Title and description are required",
        });
    }

    try {
        const newTicket = await Ticket.create({
            title,
            description,
            createdBy: req.user._id.toString(),
        });

        // now ticket has created, tell inngest to do backgroud tasks
        await inngest.send({
            name: "ticket/created",
            data: {
                ticketId: newTicket._id.toString(),
                title,
                description,
                createdBy: req.user._id.toString(),
            },
        });

        return res.status(201).json({
            message: "Ticket created and processing started",
            ticket: newTicket,
        });
    } catch (error) {
        console.error("Error creating ticket", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
