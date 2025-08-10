import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectToDatabase } from "./db.js";
import User from "./models/User.js";
import { hashPassword } from "./utils/password.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

async function run() {
  await connectToDatabase();
  const email = "admin@example.com";
  const exists = await User.findOne({ email }).lean();
  if (!exists) {
    const passwordHash = await hashPassword("admin123");
    await User.create({ name: "Admin", email, passwordHash });
    console.log("Seeded admin user:", email, "password: admin123");
  } else {
    console.log("Admin already exists:", email);
  }
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


