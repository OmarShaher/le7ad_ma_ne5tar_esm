import mongoose from "mongoose";

let memoryServer = null;

export async function connectToDatabase() {
  let uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/le7ad_ma_ne5tar_esm";
  const dbName = process.env.MONGODB_DB || undefined;

  // Optional: use ephemeral in-memory MongoDB for local dev
  if (String(process.env.USE_MEMORY_DB).toLowerCase() === "1" || String(process.env.USE_MEMORY_DB).toLowerCase() === "true") {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
    console.log(`[server] Using in-memory MongoDB at ${uri}`);
  }

  mongoose.connection.on("connected", () => {
    console.log("[server] MongoDB connected");
  });
  mongoose.connection.on("error", (err) => {
    console.error("[server] MongoDB error:", err);
  });

  // Ensure graceful shutdown for memory server
  const teardown = async () => {
    try {
      await mongoose.disconnect();
      if (memoryServer) await memoryServer.stop();
    } catch {}
    process.exit(0);
  };
  if (!process.listeners("SIGINT").some((l) => l.name === "teardown")) process.on("SIGINT", teardown);
  if (!process.listeners("SIGTERM").some((l) => l.name === "teardown")) process.on("SIGTERM", teardown);

  return mongoose.connect(uri, dbName ? { dbName } : undefined);
}


