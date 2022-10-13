import { Comment } from "./../../entity/Comment";
import { Bug } from "./../../entity/Bug";
import { db } from "../../data-source";
import { User } from "../../entity/User";
import { ApiError } from "./../../errros/ApiError";

export const getComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const commentRepo = db.getRepository(Comment);
    const comment = await commentRepo.findOne({
      where: {
        id,
      },
      relations: {
        children: true,
        parent: true,
      },
    });

    res.json({ comment });
  } catch (e) {
    next(e);
  }
};
