import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function connectDB() {
  try {
    const db = await mongoose.connect(process.env.MONGOOSE_URI);
    console.log(`MongoDB connected : ${db.connection.host}`);
  } catch (error) {
    console.log(`Error during connecting to DB : ${error.message}`);
    process.exit(1);
  }
}
