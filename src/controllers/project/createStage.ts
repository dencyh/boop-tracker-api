import { Stage } from "./../../entity/Stage";
import { db } from "../../data-source";
import { Token } from "../../entity/Token";
import { User } from "../../entity/User";
import { ApiError } from "../../errros/ApiError";

export const createStage = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    const tokenRepo = db.getRepository(Token);
    const token = await tokenRepo.findOne({
      where: { refreshToken },
      relations: {
        user: {
          trackingProjects: true,
        },
      },
    });
    const user = token.user;

    const { text, nextStage, userId, projectId } = req.body;

    const project = user.trackingProjects.find(
      (project) => project.id === Number(projectId)
    );

    if (!project) {
      throw ApiError.BadRequest("user do not have access to this project");
    }

    const newStage = db.manager.create(Stage, {
      text,
      next: nextStage,
      project,
    });

    await db.manager.save(newStage);

    res.json({ newStage });
  } catch (e) {
    next(e);
  }
};
