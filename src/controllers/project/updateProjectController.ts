import { IProject } from "./../../../../boop-tracker-client/src/models/IProject";
import { db } from "../../data-source";
import { Project } from "../../entity/Project";
import { Token } from "../../entity/Token";
import { ApiError } from "../../errros/ApiError";

export const updateProject = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const { projectId } = req.params;
    const { option, newValue } = req.body;

    const tokenRepo = db.getRepository(Token);
    const token = await tokenRepo.findOne({
      where: { refreshToken },
      relations: {
        user: {
          trackingProjects: {
            createdBy: true,
          },
        },
      },
    });
    const user = token.user;

    const project = user.trackingProjects.find((project) => {
      return project.id === Number(projectId);
    });

    if (!project) {
      throw ApiError.BadRequest("user do not have access to this project");
    }

    project[option] = newValue;
    await db.manager.save(project);

    res.json(project);
  } catch (err) {
    next(err);
  }
};
