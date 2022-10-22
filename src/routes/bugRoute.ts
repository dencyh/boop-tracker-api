import { updateBug } from "./../controllers/bug/updateBug";
import { getBug } from "./../controllers/bug/getBug";
import { createBug } from "./../controllers/bug/createBug";
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { deleteBug } from "../controllers/bug/deleteBug";

export const bugRouter = express.Router();

bugRouter.route("/bugs").post(authMiddleware, createBug);
bugRouter.route("/bugs/:bugId").get(authMiddleware, getBug);
bugRouter.route("/bugs/:bugId").patch(authMiddleware, updateBug);
bugRouter.route("/bugs/:bugId").delete(authMiddleware, deleteBug);
