import chalk from "chalk";
import cookieParser from "cookie-parser";
import "dotenv/config";
import morgan from "morgan";
import express from "express";
import { morganMiddleware, systemLogs } from "./utils/Logger.js";
import connectDB from "./config/connectDB.js";
import mongoSanitize from "express-mongo-sanitize";

await connectDB();
const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(mongoSanitize());
app.use(morganMiddleware);

const PORT = process.env.PORT || 5000;

app.get("/api/v1/test", (req, res) => {
  res.json({ success: "Testing is success" });
});

app.listen(PORT, () => {
  console.log(
    `Server is running in ${chalk.yellow.bold(
      process.env.NODE_ENV
    )} mode on port ${chalk.blue.bold(PORT)}`
  );
  systemLogs.info(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});
