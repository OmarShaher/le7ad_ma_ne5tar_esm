import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectToDatabase } from "./db.js";
import User from "./models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

async function updateAllUsers() {
  try {
    await connectToDatabase();
    
    // Find all users that don't have stats or have incomplete stats
    const usersWithoutStats = await User.find({
      $or: [
        { stats: { $exists: false } },
        { "stats.completed": { $exists: false } },
        { "stats.inProgress": { $exists: false } },
        { "stats.studyTimeHours": { $exists: false } },
        { "stats.streak": { $exists: false } }
      ]
    });

    console.log(`Found ${usersWithoutStats.length} users to update`);

    if (usersWithoutStats.length === 0) {
      console.log("All users already have complete stats!");
      process.exit(0);
    }

    // Update all users with default stats
    const result = await User.updateMany(
      {
        $or: [
          { stats: { $exists: false } },
          { "stats.completed": { $exists: false } },
          { "stats.inProgress": { $exists: false } },
          { "stats.studyTimeHours": { $exists: false } },
          { "stats.streak": { $exists: false } }
        ]
      },
      {
        $set: {
          "stats.completed": 0,
          "stats.inProgress": 0,
          "stats.studyTimeHours": 0,
          "stats.streak": 0,
          "stats.lastActivity": null
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} users with default stats`);

    // Show all users with their stats
    const allUsers = await User.find({}, { name: 1, email: 1, stats: 1 }).lean();
    
    console.log("\n=== ALL USERS WITH STATS ===");
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Stats:`, user.stats);
      console.log("");
    });

    process.exit(0);
  } catch (error) {
    console.error("Error updating users:", error);
    process.exit(1);
  }
}

updateAllUsers();
