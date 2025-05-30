import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { getUsers, updateUser } from "../controllers/user.controller.js";

const userRoutes = express.Router();

userRoutes.post("/update", isLoggedIn, updateUser);
userRoutes.get("/", isLoggedIn, getUsers);

export default userRoutes;
