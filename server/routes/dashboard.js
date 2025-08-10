import { Router } from "express";
import DashboardSummary from "../models/DashboardSummary.js";
import MockInterview from "../models/MockInterview.js";
import QuestionAttempt from "../models/QuestionAttempt.js";
import User from "../models/User.js";
import { requireAuth } from "./auth.js";

const router = Router();

router.get("/dashboard/summary", requireAuth, async (req, res) => {
  try {
    // Get user with stats
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    // Get or create dashboard summary
    let summary = await DashboardSummary.findOne({ userId: req.user.id }).lean();
    
    if (!summary) {
      // Calculate dashboard data if no summary exists
      const [mockCount, solvedCount, correctCount] = await Promise.all([
        MockInterview.countDocuments({ userId: req.user.id }),
        QuestionAttempt.countDocuments({ userId: req.user.id }),
        QuestionAttempt.countDocuments({ userId: req.user.id, status: "correct" }),
      ]);

      summary = {
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
    }

    // Get user stats (with defaults if not set)
    const userStats = user.stats || { completed: 0, inProgress: 0, studyTimeHours: 0, streak: 0 };

    // Combine dashboard summary with user stats
    const response = {
      ...summary,
      stats: userStats,
    };

    return res.json(response);
  } catch (err) {
    console.error("[GET /api/dashboard/summary]", err);
    res.status(500).json({ error: "Failed to load summary" });
  }
});

// Helper function to update user statistics
async function updateUserStats(userId, { completed, inProgress, studyTimeMinutes, isNewActivity = false }) {
  const updates = {};
  
  if (typeof completed === 'number') updates['stats.completed'] = completed;
  if (typeof inProgress === 'number') updates['stats.inProgress'] = inProgress;
  if (typeof studyTimeMinutes === 'number') {
    updates['stats.studyTimeHours'] = Math.round(studyTimeMinutes / 60);
  }
  
  if (isNewActivity) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const user = await User.findById(userId).lean();
    const lastActivity = user?.stats?.lastActivity ? new Date(user.stats.lastActivity) : null;
    
    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day - increment streak
        updates['stats.streak'] = (user?.stats?.streak || 0) + 1;
      } else if (daysDiff > 1) {
        // Gap in activity - reset streak
        updates['stats.streak'] = 1;
      }
      // Same day - no change to streak
    } else {
      // First activity ever
      updates['stats.streak'] = 1;
    }
    
    updates['stats.lastActivity'] = new Date();
  }
  
  if (Object.keys(updates).length > 0) {
    await User.findByIdAndUpdate(userId, { $set: updates });
  }
}

export default router;



