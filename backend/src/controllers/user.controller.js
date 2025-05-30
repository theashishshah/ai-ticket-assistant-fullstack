import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import inngest from "../inngest/client.js";

export const signup = async (req, res) => {
    const { email, password, skills = [] } = req.body;

    if (!email || !password) {
        return res.status(401).json({
            success: false,
            message: "All fields are required, try again.",
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
            skills,
        });

        // fire up inngest event because it is containing the whole things
        await inngest.send({
            name: "user/signup",
            data: { email },
        });

        const jwtToken = jwt.sign(
            {
                _id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
        );

        res.status(200).json({
            success: true,
            message: "User signed in successfully.",
            jwtToken,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while signning user",
            error,
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({
            success: false,
            message: "All fields are required, try again.",
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({
                success: false,
                message: "User doesn't exist with this email id, try again.",
                email,
            });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            res.status(401).json({
                success: false,
                message: "Incorrect password",
                password,
            });
        }

        const jwtToken = jwt.sign(
            {
                _id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
        );

        res.status(200).json({
            success: true,
            message: "User logged in.",
            user,
            jwtToken,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while logging user",
            error,
        });
    }
};

export const logout = async (req, res) => {
    console.log("What's inside headers", req.headers);

    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded value after verifying token: ", decoded);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user.",
            });
        }

        res.status(200).json({
            success: true,
            message: "User logged out successfully.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while logging out user",
            error,
        });
    }
};

export const updateUser = async (req, res) => {
    const { skills = [], role, email } = req.body;

    try {
        if (req.user?.role !== "Admin" || role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "Forbidden to modify.",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User doesn't exist with this email.",
            });
        }

        const updatedUser = await User.updateOne(
            { email },
            { skills: skills.length ? skills : user.skills, role },
        );

        res.status(200).json({
            success: true,
            message: "User updated successfully.",
            updateUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while updating user",
            error,
        });
    }
};

export const getUsers = async (req, res) => {
    const { role } = req.body;

    try {
        if (req.user?.role !== "Admin" || role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "Forbidden to get user's detail.",
            });
        }

        const users = await User.find().select("-password");
        res.status(200).json({
            success: true,
            message: "Retrived all users successfully.",
            users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while getting user",
            error,
        });
    }
};
