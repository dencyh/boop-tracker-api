import { getTrackingProjects } from "../controllers/project/getTrackingProjectsController";
import express from "express";
import { createController } from "../controllers/project/createController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const projectRouter = express.Router();

projectRouter.route("/projects").post(authMiddleware, createController);
projectRouter.route("/projects").get(authMiddleware, getTrackingProjects);
