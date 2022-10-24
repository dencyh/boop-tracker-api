import { db } from "../../data-source";
import { Bug } from "../../entity/Bug";
import { Token } from "../../entity/Token";
import { ApiError } from "../../errros/ApiError";

export const deleteBug = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const { bugId } = req.params;

    const tokenRepo = db.getRepository(Token);
    const token = await tokenRepo.findOne({
      where: { refreshToken },
      relations: {
        user: true,
      },
    });
    const user = token.user;

    const bugRepo = db.getRepository(Bug);
    const bug = await bugRepo.findOne({
      where: { id: Number(bugId) },
      relations: { createdBy: true },
    });

    const deleteAccess = user.id === bug.createdBy.id;

    if (!deleteAccess) {
      throw ApiError.BadRequest("user do not have access to edit this bug");
    }

    const deletedBug = await bugRepo.delete(bug.id);

    res.json(deletedBug);
  } catch (err) {
    next(err);
  }
};
