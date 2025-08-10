import mongoose from "mongoose";

const MockInterviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    scheduledAt: { type: Date },
    completedAt: { type: Date },
    score: { type: Number, min: 0, max: 100 },
  },
  { timestamps: true, versionKey: false }
);

const MockInterview = mongoose.models.MockInterview || mongoose.model("MockInterview", MockInterviewSchema);
export default MockInterview;


