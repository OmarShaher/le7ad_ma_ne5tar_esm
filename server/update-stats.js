import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectToDatabase } from "./db.js";
import User from "./models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

async function updateUserStats() {
  try {
    await connectToDatabase();
    
    // Find the user you want to update
    const email = "test@navitech.dev";
    
    // Update user stats
    const result = await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          "stats.completed": 35,
          "stats.inProgress": 3,
          "stats.studyTimeHours": 65,
          "stats.streak": 25,
          "stats.lastActivity": new Date()
        }
      },
      { new: true } // Return the updated document
    );
    
    if (result) {
      console.log("User stats updated successfully:");
      console.log("Name:", result.name);
      console.log("Email:", result.email);
      console.log("Stats:", result.stats);
    } else {
      console.log("User not found");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error updating user stats:", error);
    process.exit(1);
  }
}

updateUserStats();
