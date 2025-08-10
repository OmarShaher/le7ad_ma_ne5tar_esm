import mongoose from "mongoose";

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/le7ad_ma_ne5tar_esm";
  const dbName = process.env.MONGODB_DB || undefined;

  mongoose.connection.on("connected", () => {
    console.log("[server] MongoDB connected");
  });
  mongoose.connection.on("error", (err) => {
    console.error("[server] MongoDB error:", err);
  });

  return mongoose.connect(uri, dbName ? { dbName } : undefined);
}


