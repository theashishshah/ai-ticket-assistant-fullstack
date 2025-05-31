import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import ticketRoutes from "./routes/ticket.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", (req, res) => res.send("You're on home page."));
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/tickets", ticketRoutes);

export default app;
