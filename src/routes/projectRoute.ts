import { createStage } from "../controllers/stage/createStage";
import { getTrackingProjects } from "../controllers/project/getTrackingProjectsController";
import express from "express";
import { createController } from "../controllers/project/createProject";
import { authMiddleware } from "../middlewares/authMiddleware";
import { updateStage } from "../controllers/stage/updateStage";
import { deleteStage } from "../controllers/stage/deleteStage";

export const projectRouter = express.Router();

projectRouter.route("/projects").post(authMiddleware, createController);
projectRouter.route("/projects").get(authMiddleware, getTrackingProjects);
projectRouter.route("/projects/stages").post(authMiddleware, createStage);
projectRouter
  .route("/projects/stages/:stageId")
  .patch(authMiddleware, updateStage);
projectRouter
  .route("/projects/stages/:stageId")
  .delete(authMiddleware, deleteStage);
