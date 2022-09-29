import bcrypt from "bcrypt";

import { db } from "../../data-source";
import { User } from "../../entity/User";
import { ApiError } from "../../errros/ApiError";
import { generateToken, saveToken } from "../../helpers/tokenHelper";

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await db.manager.findOneBy(User, { email });

    if (!user) {
      throw ApiError.BadRequest("email not found");
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      throw ApiError.BadRequest("wrong password");
    }
    const tokens = generateToken(user.id);
    await saveToken(user.id, tokens.refreshToken);

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.json({ tokens, user });
  } catch (err) {
    // console.log(err);
    next(err);
  }
};
