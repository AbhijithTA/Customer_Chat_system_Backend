import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected ");
  } catch (err) {
    console.log("Database connection error" + err);
    process.exit(1);
  }
};

export default connectDB;
