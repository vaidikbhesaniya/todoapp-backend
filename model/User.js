import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    profilePicture: {
        type: String,
        default: "",
    },
    publicId: {
        type: String,
        default: "",
    },
    todos: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Todo",
        default: [],
    },
});

export default mongoose.model("User", UserSchema);
