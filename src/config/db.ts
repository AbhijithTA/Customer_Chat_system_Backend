import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in environment variables.");
  }

  try {
    const connection = await mongoose.connect(mongoUri);
    console.log("Database connected");
  } catch (err) {
    console.log("Database connection error: " + err);
    process.exit(1);
  }
};

export default connectDB;
