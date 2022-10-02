import { createBug } from "./../controllers/bug/createBug";
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";

export const bugRouter = express.Router();

bugRouter.route("/bugs").post(authMiddleware, createBug);
// bugRouter.route("/bugs").get(authMiddleware, getTrackingProjects);
