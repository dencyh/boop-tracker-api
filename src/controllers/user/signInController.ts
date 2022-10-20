import { Token } from "./../../entity/Token";
import bcrypt from "bcrypt";

import { db } from "../../data-source";
import { User } from "../../entity/User";
import { ApiError } from "../../errros/ApiError";
import { generateToken, saveToken } from "../../helpers/tokenHelper";

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userFromDb = await db.manager.findOneBy(User, { email });

    if (!userFromDb) {
      throw ApiError.BadRequest("email not found");
    }

    const validPassword = bcrypt.compareSync(password, userFromDb.password);
    if (!validPassword) {
      throw ApiError.BadRequest("wrong password");
    }
    const tokens = generateToken(userFromDb.id);

    const tokenRepo = db.getRepository(Token);
    // const allTokens = await tokenRepo.find({
    //   relations: {
    //     user: true,
    //   },
    //   where: {
    //     user: {
    //       id: 1,
    //     },
    //   },
    // });
    await saveToken(userFromDb, tokens.refreshToken);

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.json({ tokens, user: userFromDb });
  } catch (err) {
    next(err);
  }
};
