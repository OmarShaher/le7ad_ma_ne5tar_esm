import mongoose from "mongoose";

const QuestionAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true, index: true },
    status: { type: String, enum: ["correct", "incorrect", "skipped"], required: true },
    timeSpentSec: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

const QuestionAttempt = mongoose.models.QuestionAttempt || mongoose.model("QuestionAttempt", QuestionAttemptSchema);
export default QuestionAttempt;



