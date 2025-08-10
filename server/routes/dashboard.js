import { Router } from "express";
import DashboardSummary from "../models/DashboardSummary.js";
import MockInterview from "../models/MockInterview.js";
import QuestionAttempt from "../models/QuestionAttempt.js";
import { requireAuth } from "./auth.js";

const router = Router();

router.get("/dashboard/summary", requireAuth, async (req, res) => {
  try {
    const summary = await DashboardSummary.findOne({ userId: req.user.id }).lean();
    if (summary) return res.json(summary);

    // Fallback compute: lightweight, do not block UI
    const [mockCount, solvedCount, correctCount] = await Promise.all([
      MockInterview.countDocuments({ userId: req.user.id }),
      QuestionAttempt.countDocuments({ userId: req.user.id }),
      QuestionAttempt.countDocuments({ userId: req.user.id, status: "correct" }),
    ]);

    const computed = {
      userId: req.user.id,
      mockInterviewsCount: mockCount,
      successRate: solvedCount > 0 ? correctCount / solvedCount : 0,
      problemsSolvedCount: solvedCount,
      cards: {
        technicalQuestions: { total: 200, completed: Math.min(solvedCount, 200), progressPercent: Math.round((Math.min(solvedCount, 200) / 200) * 100) },
        mockInterviews: { scheduled: 0, completed: mockCount, avgScore: 0 },
        companyPrep: { activeCompany: "", progressPercent: 0 },
      },
      lastUpdated: new Date(),
    };
    return res.json(computed);
  } catch (err) {
    console.error("[GET /api/dashboard/summary]", err);
    res.status(500).json({ error: "Failed to load summary" });
  }
});

export default router;


