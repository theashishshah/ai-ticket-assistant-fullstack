import express from "express";
import cors from "cors";
import userRoutes from "./routes/auth.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", (req, res) => res.send("You're on home page."));
app.use("/auth", userRoutes);

export default app;
