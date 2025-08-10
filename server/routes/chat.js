import { Router } from "express";
import Message from "../models/Message.js";

const router = Router();

router.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ timestamp: 1 }).lean();
    res.json(messages);
  } catch (error) {
    console.error("[GET /api/messages]", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    const language = /[\u0600-\u06FF]/.test(text) ? "ar" : "en";

    const userMessage = await Message.create({ text, isBot: false, language });

    const botText =
      language === "ar"
        ? "شكراً لسؤالك! هذا سؤال ممتاز. دعني أوضح لك..."
        : "Great question! Let me explain this concept to you...";

    const botMessage = await Message.create({ text: botText, isBot: true, language });

    res.json({ userMessage, botMessage });
  } catch (error) {
    console.error("[POST /api/chat]", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
});

export default router;


