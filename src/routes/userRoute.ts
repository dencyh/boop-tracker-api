import {getUsers} from "./../controllers/user/getUsersController";
import express from "express";
import {signupUser} from "../controllers/user/signupController";
import {authUser} from "../controllers/user/authController";
import {check} from "express-validator";
import {authMiddleware} from "../middlewares/authMiddleware";

export const userRouter = express.Router();

userRouter.route("/").get(authMiddleware, getUsers);

userRouter
  .route("/signup")
  .post(
    [
      check("first_name", "Cannot be empty").notEmpty(),
      check("last_name", "Cannot be empty").notEmpty(),
      check("email", "Must be an email").isEmail(),
      check("password", "Must be at least 6 symbols").isLength({min: 6}),
    ],
    signupUser
  );
userRouter.route("/auth").post(authMiddleware, authUser);
