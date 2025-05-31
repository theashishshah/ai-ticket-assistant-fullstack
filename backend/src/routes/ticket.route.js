import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { createTicket, getTicket, getTickets } from "../controllers/ticket.controller.js";

const ticketRoutes = express.Router();

ticketRoutes.post("/", isLoggedIn, createTicket);
ticketRoutes.get("/", isLoggedIn, getTickets);
ticketRoutes.get("/:id", isLoggedIn, getTicket);

export default ticketRoutes;
