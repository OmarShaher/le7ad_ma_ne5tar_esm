import mongoose from "mongoose";

const CardsSchema = new mongoose.Schema(
  {
    technicalQuestions: {
      total: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
      progressPercent: { type: Number, default: 0 },
    },
    mockInterviews: {
      scheduled: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
      avgScore: { type: Number, default: 0 },
    },
    companyPrep: {
      activeCompany: { type: String, default: "" },
      progressPercent: { type: Number, default: 0 },
    },
  },
  { _id: false }
);

const DashboardSummarySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, unique: true },
    mockInterviewsCount: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
    problemsSolvedCount: { type: Number, default: 0 },
    cards: { type: CardsSchema, default: () => ({}) },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false }
);

const DashboardSummary =
  mongoose.models.DashboardSummary || mongoose.model("DashboardSummary", DashboardSummarySchema);
export default DashboardSummary;



