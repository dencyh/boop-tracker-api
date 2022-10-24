import { commentRouter } from "./routes/commentRoute";
import { bugRouter } from "./routes/bugRoute";
import { projectRouter } from "./routes/projectRoute";
import cookies from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { db } from "./data-source";
import { errorHandler } from "./middlewares/errorHandler";
import { userRouter } from "./routes/userRoute";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

const main = async () => {
  try {
    await db.initialize();
    console.log("Database connected sucessfully");

    app.use(cookies());
    app.use(express.json());
    app.use(
      cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
      })
    );

    app.use("/api", userRouter);
    app.use("/api", projectRouter);
    app.use("/api", bugRouter);
    app.use("/api", commentRouter);

    app.use(errorHandler);
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

main();
