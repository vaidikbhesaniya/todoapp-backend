import { model, Schema } from "mongoose";

const TodoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
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
    enum: { values: ["PENDING", "COMPLETED"], message: "Invalid status" },
    default: "PENDING",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model("Todo", TodoSchema);
