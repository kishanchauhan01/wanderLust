import mongoose from "mongoose";

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(MONGO_URL);
    console.log("DB connected!");
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};

export default connectDB;
