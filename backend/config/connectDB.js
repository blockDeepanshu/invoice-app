import chalk from "chalk";
import mongoose from "mongoose";
import { systemLogs } from "../utils/Logger.js";

const connectDB = async () => {
  try {
    const connectionParams = {
      dbName: process.env.DB_NAME,
    };
    const connect = await mongoose.connect(
      process.env.MONGO_URI,
      connectionParams
    );
    console.log(
      `${chalk.blue.bold(`MongoDB Connected :${connect.connection.host}`)}`
    );
    systemLogs.info(`MongoDB Connected :${connect.connection.host}`);
  } catch (error) {
    console.log(
      `${chalk.red.bold(`Error in mongo connection:${error.message}`)}`
    );
  }
};

export default connectDB;
