import { Project } from "../../entity/Project";
import { db } from "../../data-source";
import { ApiError } from "../../errros/ApiError";
import { Token } from "../../entity/Token";
import { User } from "../../entity/User";
import { In } from "typeorm";

export const getTrackingProjects = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    // Get user by refreshtoken
    const tokenFromDb = await db.manager.findOneBy(Token, { refreshToken });

    const userRepo = db.manager.getRepository(User);
    const user = await userRepo.findOne({
      where: {
        id: tokenFromDb.user.id,
      },
      relations: {
        trackingProjects: true,
      },
    });

    const projectIds = user.trackingProjects.map((project) => project.id);

    const projectRepo = db.manager.getRepository(Project);
    const projectsWithBugs = await projectRepo.find({
      where: {
        id: In(projectIds),
      },
      relations: {
        bugs: {
          assignedTo: true,
        },
      },
    });

    res.json(projectsWithBugs);
  } catch (err) {
    next(err);
  }
};
