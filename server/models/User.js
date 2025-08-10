import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    university: { type: String, default: "", trim: true },
    // User personal statistics
    stats: {
      completed: { type: Number, default: 0 }, // Completed tasks/exercises
      inProgress: { type: Number, default: 0 }, // Tasks in progress
      studyTimeHours: { type: Number, default: 0 }, // Total study time in hours
      streak: { type: Number, default: 0 }, // Current streak
      lastActivity: { type: Date, default: null }, // Last activity date for streak calculation
    },
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;


