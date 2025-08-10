import { Router } from "express";
import Question from "../models/Question.js";
import QuestionAttempt from "../models/QuestionAttempt.js";
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
    res.json({ status: attempt.status });
  } catch (err) {
    console.error("[POST /api/questions/:id/attempt]", err);
    res.status(500).json({ error: "Failed to submit attempt" });
  }
});

export default router;


