import { Comment } from "./../../entity/Comment";
import { db } from "../../data-source";

export const getComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const commentRepo = db.getRepository(Comment);
    const comment = await commentRepo.findOne({
      where: {
        id,
      },
      relations: {
        parent: true,
      },
    });

    res.json({ comment });
  } catch (e) {
    next(e);
  }
};
