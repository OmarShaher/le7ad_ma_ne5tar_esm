// Modified: Added CORS with CLIENT_ORIGIN, mounted auth routes, and health route for API
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectToDatabase } from "./db.js";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

// Ensure we load env from server/.env (not project root)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// Restrict CORS to the configured client origin if provided
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:8080";
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());

app.use("/api", chatRoutes);
app.use("/api", authRoutes);

// Basic health check at root
app.get("/", (req, res) => {
  res.type("text").send("API OK");
});

const PORT = process.env.PORT || 3001;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[server] API listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });


