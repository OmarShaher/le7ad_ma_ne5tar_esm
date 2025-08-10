import { Router } from "express";
import Question from "../models/Question.js";
import QuestionAttempt from "../models/QuestionAttempt.js";
import User from "../models/User.js";
import { requireAuth } from "./auth.js";

const router = Router();

router.get("/questions", requireAuth, async (req, res) => {
  try {
    const { limit = 10, difficulty } = req.query;
    const query = difficulty ? { difficulty } : {};
    const items = await Question.find(query).limit(Math.min(50, Number(limit) || 10)).lean();
    res.json(items);
  } catch (err) {
    console.error("[GET /api/questions]", err);
    res.status(500).json({ error: "Failed to load questions" });
  }
});

router.post("/questions/:id/attempt", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { selectedIndex } = req.body || {};
    const q = await Question.findById(id).lean();
    if (!q) return res.status(404).json({ error: "Question not found" });
    
    const status = typeof selectedIndex === "number" && selectedIndex === q.correctIndex ? "correct" : "incorrect";
    const attempt = await QuestionAttempt.create({ userId: req.user.id, questionId: id, status, timeSpentSec: 0 });
    
    // Update user statistics
    await updateUserStats(req.user.id, status);
    
    res.json({ status: attempt.status });
  } catch (err) {
    console.error("[POST /api/questions/:id/attempt]", err);
    res.status(500).json({ error: "Failed to submit attempt" });
  }
});

// Helper function to update user statistics when they complete questions
async function updateUserStats(userId, status) {
  try {
    const [correctCount, totalCount] = await Promise.all([
      QuestionAttempt.countDocuments({ userId, status: "correct" }),
      QuestionAttempt.countDocuments({ userId }),
    ]);
    
    const inProgressCount = totalCount - correctCount;
    
    // Update user stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const user = await User.findById(userId).lean();
    const lastActivity = user?.stats?.lastActivity ? new Date(user.stats.lastActivity) : null;
    
    let newStreak = user?.stats?.streak || 0;
    
    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day - increment streak
        newStreak = newStreak + 1;
      } else if (daysDiff > 1) {
        // Gap in activity - reset streak
        newStreak = 1;
      }
      // Same day - no change to streak
    } else {
      // First activity ever
      newStreak = 1;
    }
    
    // Calculate study time (simplified: 1 minute per attempt)
    const studyTimeHours = Math.max(1, Math.round(totalCount / 60)); // At least 1 hour
    
    await User.findByIdAndUpdate(userId, {
      $set: {
        'stats.completed': correctCount,
        'stats.inProgress': inProgressCount,
        'stats.studyTimeHours': studyTimeHours,
        'stats.streak': newStreak,
        'stats.lastActivity': new Date(),
      }
    });
  } catch (err) {
    console.error("Failed to update user stats:", err);
  }
}

export default router;




