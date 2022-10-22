import { Bug } from "./../../entity/Bug";
import { db } from "./../../data-source";
import { ApiError } from "../../errros/ApiError";

export const updateBug = async (req, res, next) => {
  try {
    const { bugId } = req.params;
    if (!bugId) {
      throw ApiError.BadRequest("wrong bug bugId");
    }
    const { field, newValue } = req.body;

    const bug = await db.manager.findOneBy(Bug, { id: bugId });

    if (bug[field] === undefined) {
      throw ApiError.BadRequest("bug field not found");
    }

    bug[field] = newValue;

    await db.manager.save(bug);

    res.send(bug);
  } catch (e) {
    next(e);
  }
};
