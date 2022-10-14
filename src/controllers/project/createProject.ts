import jwt from "jsonwebtoken";
import { In } from "typeorm";
import { db } from "../../data-source";
import { Project } from "../../entity/Project";
import { Token } from "../../entity/Token";
import { User } from "../../entity/User";
import { ApiError } from "../../errros/ApiError";

export const createController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const createdByUser = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    if (!createdByUser) {
      throw ApiError.UnauthorizedError();
    }

    const {
      title,
      description,
      closed,
      deadline,
      viewers: usersToGiveAccessTo,
    } = req.body;

    // Get user by refreshtoken
    const tokenFromDb = await db.manager.findOneBy(Token, { refreshToken });

    const userRepo = db.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: tokenFromDb.user.id },
      relations: {
        trackingProjects: true,
      },
    });

    const project = db.manager.create(Project, {
      title,
      description,
      closed,
      deadline,
      createdBy: user,
    });

    await db.manager.save(project);

    const newViewers = await userRepo.find({
      where: {
        id: In([...usersToGiveAccessTo]),
      },
      relations: {
        trackingProjects: true,
      },
    });

    const allViewers = newViewers
      .filter((viewer: User) => viewer.id !== user.id)
      .concat(user);

    allViewers.forEach(async (viewer) => {
      viewer.trackingProjects = [...(viewer.trackingProjects || []), project];
      await db.manager.save(viewer);
    });

    res.json({ project, user });
  } catch (e) {
    next(e);
  }
};
