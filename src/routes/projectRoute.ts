import { createStage } from "../controllers/project/stage/createStage";
import { getTrackingProjects } from "../controllers/project/getTrackingProjectsController";
import express from "express";
import { createController } from "../controllers/project/createProject";
import { authMiddleware } from "../middlewares/authMiddleware";
import { updateStage } from "../controllers/project/stage/updateStage";

export const projectRouter = express.Router();

projectRouter.route("/projects").post(authMiddleware, createController);
projectRouter.route("/projects").get(authMiddleware, getTrackingProjects);
projectRouter.route("/projects/stages").post(authMiddleware, createStage);
projectRouter
  .route("/projects/stages/:stageId")
  .patch(authMiddleware, updateStage);
