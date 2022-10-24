import { db } from "../../data-source";
import { Token } from "../../entity/Token";
import { ApiError } from "../../errros/ApiError";

export const getProject = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const { projectId } = req.params;

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

    const projectToShow = user.trackingProjects.find((project) => {
      return project.id === Number(projectId);
    });

    if (!projectToShow) {
      throw ApiError.BadRequest("user do not have access to this project");
    }

    res.json(projectToShow);
  } catch (e) {
    next(e);
  }
};
