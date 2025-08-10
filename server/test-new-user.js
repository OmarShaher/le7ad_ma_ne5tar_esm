import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectToDatabase } from "./db.js";
import User from "./models/User.js";
import { hashPassword } from "./utils/password.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

async function testNewUserCreation() {
  try {
    await connectToDatabase();
    
    // Create a test user
    const testEmail = `test-user-${Date.now()}@example.com`;
    const passwordHash = await hashPassword("TestPassword123");
    
    console.log("🧪 Creating test user...");
    
    const newUser = await User.create({
      name: "Test User",
      email: testEmail,
      passwordHash: passwordHash,
      university: "Test University"
    });

    console.log("✅ Test user created successfully!");
    console.log("📋 User Details:");
    console.log("   ID:", newUser._id);
    console.log("   Name:", newUser.name);
    console.log("   Email:", newUser.email);
    console.log("   University:", newUser.university);
    console.log("   Stats:", JSON.stringify(newUser.stats, null, 4));
    
    // Verify the stats structure
    const expectedStats = {
      completed: 0,
      inProgress: 0,
      studyTimeHours: 0,
      streak: 0,
      lastActivity: null
    };
    
    const actualStats = newUser.stats;
    
    console.log("\n🔍 Verification:");
    let allGood = true;
    
    for (const [key, expectedValue] of Object.entries(expectedStats)) {
      const actualValue = actualStats[key];
      if (actualValue === expectedValue) {
        console.log(`   ✅ ${key}: ${actualValue} (correct)`);
      } else {
        console.log(`   ❌ ${key}: ${actualValue} (expected: ${expectedValue})`);
        allGood = false;
      }
    }
    
    if (allGood) {
      console.log("\n🎉 All stats are correctly initialized!");
    } else {
      console.log("\n⚠️  Some stats are not correctly initialized!");
    }
    
    // Clean up - delete the test user
    await User.findByIdAndDelete(newUser._id);
    console.log("\n🧹 Test user cleaned up");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

testNewUserCreation();
