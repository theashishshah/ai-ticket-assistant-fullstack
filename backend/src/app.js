import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import ticketRoutes from "./routes/ticket.route.js";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";
import { onUserSignUp } from "./inngest/inngest-utils/on-signup.inngest.js";
import { onTicketCreated } from "./inngest/inngest-utils/on-ticket-create.inngest.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/", (req, res) => res.send("You're on home page."));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use(
    "/apiinngest",
    serve({
        client: inngest,
        functions: [onTicketCreated, onUserSignUp],
    }),
);

export default app;
