import { db } from "../../data-source";
import { Token } from "../../entity/Token";
import { ApiError } from "../../errros/ApiError";

export const updateProject = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const { projectId } = req.params;
    const { key, newValue } = req.body;

    const tokenRepo = db.getRepository(Token);
    const token = await tokenRepo.findOne({
      where: { refreshToken },
      relations: {
        user: {
          trackingProjects: {
            createdBy: true,
            viewers: true,
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

    if (project[key] === undefined) {
      throw ApiError.BadRequest("wrong project field");
    }

    project[key] = newValue;
    await db.manager.save(project);

    res.json(project);
  } catch (err) {
    next(err);
  }
};
