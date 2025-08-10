import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectToDatabase } from "./db.js";
import User from "./models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

async function viewUserData() {
  try {
    await connectToDatabase();
    
    // Find the user
    const user = await User.findOne({ email: "test@navitech.dev" }).lean();
    
    if (user) {
      console.log("=== USER DATA ===");
      console.log("ID:", user._id);
      console.log("Name:", user.name);
      console.log("Email:", user.email);
      console.log("University:", user.university);
      console.log("Stats:", JSON.stringify(user.stats, null, 2));
      console.log("Created:", user.createdAt);
      console.log("Updated:", user.updatedAt);
    } else {
      console.log("User not found");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error viewing user data:", error);
    process.exit(1);
  }
}

viewUserData();
