import mongoose from "mongoose";

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is required. Check your server/.env file.");
  }

  if (uri.includes("127.0.0.1") || uri.includes("localhost")) {
    console.warn(
      "MONGODB_URI is pointing to local MongoDB. If you use Atlas, update server/.env, not .env.example."
    );
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000
  });
  console.log("MongoDB connected");
}
