import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    tags: { type: [String], default: [] },
    description: { type: String, default: "" },
    choices: { type: [String], default: [] },
    correctIndex: { type: Number },
  },
  { timestamps: true, versionKey: false }
);

const Question = mongoose.models.Question || mongoose.model("Question", QuestionSchema);
export default Question;


