import { Bug } from "./../../entity/Bug";
import { db } from "./../../data-source";
import { ApiError } from "../../errros/ApiError";

export const updateBug = async (req, res, next) => {
  try {
    const { bugId } = req.params;
    if (!bugId) {
      throw ApiError.BadRequest("wrong bug bugId");
    }
    const { key, newValue } = req.body;

    const bugRepo = db.getRepository(Bug);
    const bug = await bugRepo.findOne({
      where: { id: bugId },
      relations: {
        assignedTo: true,
      },
    });

    if (bug[key] === undefined) {
      throw ApiError.BadRequest("bug key not found");
    }

    bug[key] = newValue;

    await db.manager.save(bug);

    res.send(bug);
  } catch (e) {
    next(e);
  }
};
