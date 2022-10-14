import { Comment } from "./../../entity/Comment";
import { Bug } from "./../../entity/Bug";
import { db } from "../../data-source";
import { User } from "../../entity/User";
import { ApiError } from "./../../errros/ApiError";

export const postComment = async (req, res, next) => {
  try {
    const { text, userId, bugId, parentId } = req.body;
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

    if (parentId) {
      const parent = await db.manager.findOneBy(Comment, { id: parentId });
      comment.parent = parent;
    }

    await db.manager.save(comment);

    res.json({ comment });
  } catch (e) {
    next(e);
  }
};
