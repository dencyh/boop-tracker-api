import { Bug } from "../../entity/Bug";
import jwt from "jsonwebtoken";
import { In } from "typeorm";
import { db } from "../../data-source";
import { Project } from "../../entity/Project";
import { Token } from "../../entity/Token";
import { User } from "../../entity/User";
import { ApiError } from "../../errros/ApiError";

export const getBug = async (req, res, next) => {
  try {
    const { bugId } = req.params;
    if (!bugId) {
      throw ApiError.BadRequest("wrong id");
    }

    const bugRepo = db.getRepository(Bug);
    const bug = await bugRepo.findOne({
      where: {
        id: bugId,
      },
      relations: {
        project: true,
        assignedTo: true,
        createdBy: true,
        comments: {
          user: true,
          parent: true,
        },
      },
      order: {
        comments: {
          createdAt: "ASC",
        },
      },
    });

    if (!bug) {
      throw ApiError.BadRequest("bug not found");
    }

    res.send(bug);
  } catch (e) {
    next(e);
  }
};
