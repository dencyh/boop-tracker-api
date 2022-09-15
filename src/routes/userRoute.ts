import {User} from "./../entity/User";
import express from "express";
import {db} from "../data-source";
import {signupUser} from "../controllers/user/signup";

export const userRouter = express.Router();

userRouter.route("/").get(async (req, res) => {
  const users = await db.manager.find(User);

  res.json(users);
});

userRouter.route("/signup").post(signupUser);

userRouter.route("/").post(async (req, res) => {
  const {email, password} = req.body;
  const user = new User();
  user.email = email;
  user.password = password;

  db.manager.save(user);

  res.json(user);
});
