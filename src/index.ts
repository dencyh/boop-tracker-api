import dotenv from "dotenv";
dotenv.config();
import {userRouter} from "./routes/userRoute";
import {db} from "./data-source";
import {User} from "./entity/User";
import express from "express";

const app = express();

app.use(express.json());
app.use("/api/users", userRouter);

const PORT = process.env.PORT || 5000;

db.initialize()
  .then(async () => {
    // const user = new User();
    // user.firstName = "Timber";
    // user.lastName = "Saw";
    // user.age = 25;
    // await AppDataSource.manager.save(user);
    // console.log("Saved a new user with id: " + user.id);

    // console.log("Loading users from the database...");
    // const users = await AppDataSource.manager.find(User);
    // console.log("Loaded users: ", users);
    console.log("Database connected sucessfully");
  })
  .catch((error) => console.log(error));

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
