import mongoose from "mongoose";

async function connection() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // console.log("MongoDB connected");
  } catch (err) {
    console.error("Error connecting:", err);
    process.exit(1);
  }
}

export { connection };