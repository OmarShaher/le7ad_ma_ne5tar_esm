import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectToDatabase } from "./db.js";
import User from "./models/User.js";
import QuestionAttempt from "./models/QuestionAttempt.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

async function migrateUsersWithCalculatedStats() {
  try {
    await connectToDatabase();
    
    console.log("🔄 Migrating all users with calculated stats...");
    
    // Get all users
    const users = await User.find({}).lean();
    console.log(`📊 Found ${users.length} users to process`);

    for (const user of users) {
      try {
        // Calculate real stats from their activity
        const [correctCount, totalCount] = await Promise.all([
          QuestionAttempt.countDocuments({ userId: user._id, status: "correct" }),
          QuestionAttempt.countDocuments({ userId: user._id }),
        ]);

        const inProgressCount = Math.max(0, totalCount - correctCount);
        
        // Calculate study time (1 minute per attempt, minimum 0)
        const studyTimeHours = Math.max(0, Math.round(totalCount / 60));
        
        // Calculate streak (simplified - based on recent activity)
        const recentAttempts = await QuestionAttempt.find({ userId: user._id })
          .sort({ createdAt: -1 })
          .limit(30)
          .lean();
        
        let streak = 0;
        if (recentAttempts.length > 0) {
          const today = new Date();
          const uniqueDays = new Set();
          
          for (const attempt of recentAttempts) {
            const attemptDate = new Date(attempt.createdAt);
            const daysDiff = Math.floor((today - attemptDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff <= 30) { // Within last 30 days
              uniqueDays.add(daysDiff);
            }
          }
          
          // Simple streak calculation - consecutive days from today
          let consecutiveDays = 0;
          for (let day = 0; day <= 30; day++) {
            if (uniqueDays.has(day)) {
              consecutiveDays++;
            } else {
              break;
            }
          }
          streak = consecutiveDays;
        }

        // Update user with calculated stats
        await User.findByIdAndUpdate(user._id, {
          $set: {
            "stats.completed": correctCount,
            "stats.inProgress": inProgressCount,
            "stats.studyTimeHours": studyTimeHours,
            "stats.streak": streak,
            "stats.lastActivity": recentAttempts.length > 0 ? recentAttempts[0].createdAt : null
          }
        });

        console.log(`✅ Updated ${user.name} (${user.email}): ${correctCount} completed, ${inProgressCount} in progress, ${studyTimeHours}h study time, ${streak} day streak`);

      } catch (userError) {
        console.error(`❌ Error updating user ${user.email}:`, userError.message);
      }
    }

    console.log("\n🎉 Migration completed successfully!");
    
    // Show final summary
    const updatedUsers = await User.find({}, { name: 1, email: 1, stats: 1 }).lean();
    
    console.log("\n=== FINAL USER STATS SUMMARY ===");
    updatedUsers.forEach((user, index) => {
      const stats = user.stats || {};
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   📧 ${user.email}`);
      console.log(`   ✅ Completed: ${stats.completed || 0}`);
      console.log(`   🔄 In Progress: ${stats.inProgress || 0}`);
      console.log(`   ⏰ Study Time: ${stats.studyTimeHours || 0}h`);
      console.log(`   🔥 Streak: ${stats.streak || 0} days`);
      console.log("");
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateUsersWithCalculatedStats();
