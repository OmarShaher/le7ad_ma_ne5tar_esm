import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectToDatabase } from "./db.js";
import User from "./models/User.js";
import Question from "./models/Question.js";
import QuestionAttempt from "./models/QuestionAttempt.js";
import MockInterview from "./models/MockInterview.js";
import DashboardSummary from "./models/DashboardSummary.js";
import { hashPassword } from "./utils/password.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

async function run() {
  await connectToDatabase();
  const email = "test@navitech.dev";
  let user = await User.findOne({ email });
  if (!user) {
    const passwordHash = await hashPassword("Test1234");
    user = await User.create({ name: "Test User", email, passwordHash, university: "" });
    console.log("Seeded test user:", email, "password: Test1234");
  }

  const userId = user._id;

  // Seed questions
  // Reset sample content (optional: in real seed, use upserts)
  await Question.deleteMany({});
  const questions = await Question.insertMany(
    Array.from({ length: 12 }).map((_, i) => ({
      title: `Two Sum Variant ${i + 1}`,
      difficulty: i % 3 === 0 ? "easy" : i % 3 === 1 ? "medium" : "hard",
      tags: ["array", "hashmap"],
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      choices: ["Use brute force O(n^2)", "Use hash map O(n)", "Use sort + two pointers O(n log n)", "Use binary search for each element"],
      correctIndex: 1,
    }))
  );

  // Seed attempts
  await QuestionAttempt.insertMany(
    questions.slice(0, 32).map((q, i) => ({
      userId,
      questionId: q._id,
      status: i % 4 === 0 ? "incorrect" : "correct",
      timeSpentSec: 60 + i,
    }))
  );

  // Seed mock interviews
  await MockInterview.insertMany(
    Array.from({ length: 15 }).map((_, i) => ({
      userId,
      scheduledAt: null,
      completedAt: new Date(Date.now() - i * 86400000),
      score: 70 + (i % 20),
    }))
  );

  // Seed summary matching UI
  await DashboardSummary.findOneAndUpdate(
    { userId },
    {
      userId,
      mockInterviewsCount: 15,
      successRate: 0.89,
      problemsSolvedCount: 32,
      cards: {
        technicalQuestions: { total: 200, completed: 72, progressPercent: 36 },
        mockInterviews: { scheduled: 0, completed: 15, avgScore: 86.7 },
        companyPrep: { activeCompany: "Google", progressPercent: 42 },
      },
      lastUpdated: new Date(),
    },
    { upsert: true }
  );

  // Print JWT token for convenience
  const jwt = (await import("jsonwebtoken")).default;
  const token = jwt.sign({ id: String(userId), email: email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
  console.log("Test user JWT:", token);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


