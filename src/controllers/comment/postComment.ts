import { Comment } from "./../../entity/Comment";
import { Bug } from "./../../entity/Bug";
import { In } from "typeorm";
import { db } from "../../data-source";
import { Project } from "../../entity/Project";
import { Token } from "../../entity/Token";
import { User } from "../../entity/User";
import { ApiError } from "./../../errros/ApiError";

export const postComment = async (req, res, next) => {
  try {
    const { text, userId, bugId } = req.body;
    const userRepo = db.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: userId },
    });

    const bugRepo = db.getRepository(Bug);
    const bug = await bugRepo.findOne({
      where: { id: bugId },
    });

    const comment = db.manager.create(Comment, {
      text,
      user,
      bug,
    });

    await db.manager.save(comment);

    res.json({ comment });
  } catch (e) {
    next(e);
  }
};
