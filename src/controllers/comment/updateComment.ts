import { ApiError } from "./../../errros/ApiError";
import { Comment } from "./../../entity/Comment";
import { db } from "../../data-source";
import { Token } from "../../entity/Token";

export const updateComment = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const { id } = req.params;
    const { text } = req.body;

    const tokenRepo = db.getRepository(Token);
    const token = await tokenRepo.findOne({
      where: { refreshToken },
      relations: {
        user: true,
      },
    });
    const user = token.user;

    const commentRepo = db.getRepository(Comment);
    const comment = await commentRepo.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });

    if (comment.user.id !== user.id) {
      throw ApiError.BadRequest("You are not authorized to edit this comment");
    }

    comment.text = text;

    await db.manager.save(comment);

    res.json({ comment });
  } catch (e) {
    next(e);
  }
};
