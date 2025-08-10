import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
  tags: [{ type: String }],
  choices: [{ type: String }],
  correctIndex: { type: Number },
}, { timestamps: true });

export default mongoose.model("Question", questionSchema);
