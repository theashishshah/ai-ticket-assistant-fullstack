import jwt from "jsonwebtoken";

//TODO: make cookies based authorization
export const isLoggedIn = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user. Token missing.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
            error: process.env.NODE_ENV !== "production" ? error.message : undefined,
        });
    }
};
