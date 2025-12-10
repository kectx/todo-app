import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  done: { type: Boolean, default: false },
  dueDate: {
    type: Date,
    required: false
  },
  userId: { type: String, required: true, ref: "User"} 
}, { timestamps: true });

export default mongoose.model("Todo", todoSchema);
