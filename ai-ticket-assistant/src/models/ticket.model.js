import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "To-do",
            enum: ["To-do", "In-progess", "Done"],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        priority: {
            type: String,
        },
        deadline: Date,
        shortNotes: String,
        relatedSkills: [String],
    },
    { timestamps: true },
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
