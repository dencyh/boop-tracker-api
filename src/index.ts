import dotenv from "dotenv";
dotenv.config();
import {userRouter} from "./routes/userRoute";
import {db} from "./data-source";
import express from "express";

const app = express();

const PORT = process.env.PORT || 5000;

const main = async () => {
  try {
    await db.initialize();
    console.log("Database connected sucessfully");

    app.use(express.json());
    app.use("/api/users", userRouter);

    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

main();
