import mongoose from "mongoose";
import dotenv from "./dotenv";

/**
 * Database connection
 */
export const connectDB = async () => {
  try {
    console.log("connecting database .....");
    await mongoose.connect(dotenv.MONGO_URI, {});
    console.log("database connected!");
  } catch (err: any) {
    console.log("Error Establish Db connection : ", err?.message || err);
    process.exit(1);
  }
};
