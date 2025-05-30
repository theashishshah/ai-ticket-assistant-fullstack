import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required."],
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Minimum 8 characters required."],
        maxlength: [64, "Maximum 64 characters allowed."],
    },
    role: {
        type: String,
        default: "User",
        enum: ["User", "Admin", "Moderator"]
    },
    skills: [String]
}, { timestamps: true })

const User = mongoose.model("User", userSchema)
export default User
