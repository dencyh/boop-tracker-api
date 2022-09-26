import { User } from "../../entity/User";

import { db } from "./../../data-source";

export const getUsers = async (req, res, next) => {
  try {
    const users = await db.manager.find(User);
    res.json(users);
  } catch (err) {
    next(err);
  }
};
