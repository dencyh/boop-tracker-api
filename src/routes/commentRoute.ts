import { getComment } from "./../controllers/comment/getComment";
import { postComment } from "./../controllers/comment/postComment";
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";

export const commentRouter = express.Router();

commentRouter.route("/comments").post(authMiddleware, postComment);
commentRouter.route("/comments/:id").get(authMiddleware, getComment);
