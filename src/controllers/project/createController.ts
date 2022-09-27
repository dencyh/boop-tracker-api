import jwt from "jsonwebtoken";
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

    const { title, description } = req.body;

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
      created_by: user,
    });

    user.tracking_projects = user.tracking_projects[0]
      ? [...user.tracking_projects, project]
      : [project];

    console.log(user);
    await db.manager.save(project);
    await db.manager.save(user);

    res.json({ project, user });
  } catch (e) {
    next(e);
  }
};
