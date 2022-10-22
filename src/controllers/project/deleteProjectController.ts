import { db } from "../../data-source";
import { Project } from "../../entity/Project";
import { Token } from "../../entity/Token";
import { ApiError } from "../../errros/ApiError";

export const deleteProject = async (req, res, next) => {
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
          },
        },
      },
    });
    const user = token.user;

    const projectRepo = db.getRepository(Project);
    const project = await projectRepo.findOne({
      where: { id: Number(projectId) },
      relations: { createdBy: true },
    });

    const deleteAccess = user.id === project.createdBy.id;

    if (!deleteAccess) {
      throw ApiError.BadRequest("user do not have access to this project");
    }

    const deletedProject = await projectRepo.delete(project.id);

    res.json(deletedProject);
  } catch (err) {
    next(err);
  }
};
