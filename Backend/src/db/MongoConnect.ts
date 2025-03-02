import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const mongoURL: string = process.env.MONGO_URL || "";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(mongoURL);
    console.log(connection.connection);
  } catch (error: any) {
    console.error("Database connection error :: ", error);
    process.exit(1);
  }
};

export default connectDB;
