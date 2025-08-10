import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/password.js";

const router = Router();

function signToken(user) {
  const payload = { id: user._id, email: user.email, name: user.name };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body || {};
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const existing = await User.findOne({ email }).lean();
    if (existing) return res.status(409).json({ error: "Email already registered" });
    const passwordHash = await hashPassword(password);
    const user = await User.create({ name, email, passwordHash });
    const token = signToken(user);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("[POST /api/auth/register]", err);
    res.status(500).json({ error: "Failed to register" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    res.status(500).json({ error: "Failed to login" });
  }
});

router.get("/auth/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ id: user._id, name: user.name, email: user.email, university: user.university ?? "" });
  } catch (err) {
    console.error("[GET /api/auth/me]", err);
    res.status(500).json({ error: "Failed to load user" });
  }
});

router.patch("/auth/profile", requireAuth, async (req, res) => {
  try {
    const { name, email, university } = req.body || {};
    const update = {};
    if (typeof name === "string" && name.trim()) update.name = name.trim();
    if (typeof email === "string" && email.trim()) update.email = email.trim().toLowerCase();
    if (typeof university === "string") update.university = university.trim();
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true, runValidators: true }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ id: user._id, name: user.name, email: user.email, university: user.university ?? "" });
  } catch (err) {
    console.error("[PATCH /api/auth/profile]", err);
    if (err?.code === 11000 && err?.keyPattern?.email) {
      return res.status(409).json({ error: "Email already in use" });
    }
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;


