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
    const { id } = req.params;
    if (!id) {
      throw ApiError.BadRequest("wrong id");
    }

    const bugRepo = db.getRepository(Bug);
    const bug = await bugRepo.findOne({
      where: {
        id,
      },
      relations: {
        project: true,
        assigned_to: true,
        created_by: true,
        comments: {
          user: true,
        },
      },
    });

    if (!bug) {
      throw ApiError.BadRequest("not found");
    }

    res.send(bug);
  } catch (e) {
    next(e);
  }
};
