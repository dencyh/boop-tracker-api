import express from "express";
import { body, check } from "express-validator";

import { emailController } from "../controllers/user/emailController";
import { signIn } from "../controllers/user/signInController";
import { signOut } from "../controllers/user/signOutController";
import { signUp } from "../controllers/user/signUpController";
import { refresh } from "../controllers/user/refreshController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getUsers } from "./../controllers/user/getUsersController";

export const userRouter = express.Router();

userRouter.route("/users").get(authMiddleware, getUsers);
userRouter
  .route("/signup")
  .post(
    body("firstName", "Cannot be empty").notEmpty(),
    body("lastName", "Cannot be empty").notEmpty(),
    body("email", "Must be an email").isEmail(),
    body("password", "Must be at least 6 symbols").isLength({ min: 6 }),
    signUp
  );
userRouter.route("/signin").post(signIn);
userRouter.route("/signout").post(signOut);
userRouter.route("/refresh").get(refresh);
userRouter.route("/confirm/:link").get(emailController);
