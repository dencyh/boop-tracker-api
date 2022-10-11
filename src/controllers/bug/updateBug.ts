import { Bug } from "./../../entity/Bug";
import { db } from "./../../data-source";
import { ApiError } from "../../errros/ApiError";

export const updateBug = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw ApiError.BadRequest("wrong id");
    }
    const { field, newValue } = req.body;

    const bug = await db.manager.findOneBy(Bug, { id });

    if (bug[field] === undefined) {
      throw ApiError.BadRequest("field not found");
    }

    bug[field] = newValue;

    await db.manager.save(bug);

    res.send(bug);
  } catch (e) {
    next(e);
  }
};
