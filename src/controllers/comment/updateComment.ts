import { ApiError } from "./../../errros/ApiError";
import { Comment } from "./../../entity/Comment";
import { db } from "../../data-source";

export const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, userId } = req.body;

    const commentRepo = db.getRepository(Comment);
    const comment = await commentRepo.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });

    if (comment.user.id !== userId) {
      throw ApiError.BadRequest("You are not authorized to edit this comment");
    }

    comment.text = text;

    await db.manager.save(comment);

    res.json({ comment });
  } catch (e) {
    next(e);
  }
};
