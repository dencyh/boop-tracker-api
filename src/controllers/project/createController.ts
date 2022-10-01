import jwt from "jsonwebtoken";
import { In } from "typeorm";
import { db } from "../../data-source";
import { Project } from "../../entity/Project";
import { Token } from "../../entity/Token";
import { User } from "../../entity/User";
import { ApiError } from "./../../errros/ApiError";

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

    console.log(req.body);

    const {
      title,
      description,
      closed,
      viewers: usersToGiveAccessTo,
    } = req.body;
    console.log(usersToGiveAccessTo);

    // Get user by refreshtoken
    const tokenFromDb = await db.manager.findOneBy(Token, { refreshToken });

    const userRepo = db.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: tokenFromDb.user.id },
      relations: {
        tracking_projects: true,
      },
    });

    const project = db.manager.create(Project, {
      title,
      description,
      closed,
      created_by: user,
    });

    await db.manager.save(project);

    const newViewers = await userRepo.find({
      where: {
        id: In([...usersToGiveAccessTo]),
      },
      relations: {
        tracking_projects: true,
      },
    });

    const allViewers = newViewers
      .filter((viewer: User) => viewer.id !== user.id)
      .concat(user);

    allViewers.forEach(async (viewer) => {
      viewer.tracking_projects = [...(viewer.tracking_projects || []), project];
      await db.manager.save(viewer);
    });

    res.json({ project, user });
  } catch (e) {
    next(e);
  }
};
