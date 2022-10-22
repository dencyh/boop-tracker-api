import { Bug } from "./../../entity/Bug";
import jwt from "jsonwebtoken";
import { In } from "typeorm";
import { db } from "../../data-source";
import { Project } from "../../entity/Project";
import { Token } from "../../entity/Token";
import { User } from "../../entity/User";
import { ApiError } from "./../../errros/ApiError";

export const createBug = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const createdByUser = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    if (!createdByUser) {
      throw ApiError.UnauthorizedError();
    }

    const { title, description, status, priority, due, assignedTo, projectId } =
      req.body;

    // Get user by refreshtoken
    const tokenFromDb = await db.manager.findOneBy(Token, { refreshToken });
    if (!tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const userRepo = db.getRepository(User);
    const reporter = await userRepo.findOne({
      where: { id: tokenFromDb.user.id },
    });

    const projectRepo = db.getRepository(Project);
    const relatedProject = await projectRepo.findOne({
      where: { id: projectId },
    });

    const usersToAssign = await userRepo.find({
      where: {
        id: In([...assignedTo]),
      },
      relations: {
        trackingProjects: true,
      },
    });

    const bug = db.manager.create(Bug, {
      title,
      description,
      status,
      priority,
      due,
      assignedTo: usersToAssign,
      createdBy: reporter,
      project: relatedProject,
    });

    await db.manager.save(bug);

    // const allViewers = newViewers
    //   .filter((viewer: User) => viewer.id !== user.id)
    //   .concat(user);

    // allViewers.forEach(async (viewer) => {
    //   viewer.trackingProjects = [...(viewer.trackingProjects || []), project];
    //   await db.manager.save(viewer);
    // });

    res.json({ bug });
  } catch (e) {
    next(e);
  }
};
