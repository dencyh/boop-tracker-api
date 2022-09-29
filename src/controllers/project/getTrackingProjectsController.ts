import { Project } from "../../entity/Project";
import { db } from "../../data-source";
import { ApiError } from "../../errros/ApiError";
import { Token } from "../../entity/Token";
import { User } from "../../entity/User";

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
        tracking_projects: true,
      },
    });

    res.json(user.tracking_projects);
  } catch (err) {
    next(err);
  }
};
