import { updateBug } from "./../controllers/bug/updateBug";
import { getBug } from "./../controllers/bug/getBug";
import { createBug } from "./../controllers/bug/createBug";
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";

export const bugRouter = express.Router();

bugRouter.route("/bugs").post(authMiddleware, createBug);
bugRouter.route("/bugs/:id").get(authMiddleware, getBug);
bugRouter.route("/bugs/:id").patch(authMiddleware, updateBug);
