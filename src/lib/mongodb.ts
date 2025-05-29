import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "❌ MONGODB_URI is not defined in your environment variables."
  );
}

let isConnected = false;

export default async function connectToDatabase() {
  if (isConnected) {
    console.log("✅ Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI as string, {
      dbName: "yuinek", 
    });

    isConnected = true;
    console.log("✅ Connected to MongoDB");
  } catch (error: any) {
    console.error("❌ MongoDB connection error:", error.message);
    throw new Error("Database connection failed: " + error.message);
  }
}
