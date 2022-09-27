import { User } from "../../entity/User";

import { db } from "./../../data-source";

export const getUsers = async (req, res, next) => {
  try {
    const userRepo = db.getRepository(User);
    const users = await userRepo.find({
      relations: {
        created_projects: true,
        tracking_projects: true,
      },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};
