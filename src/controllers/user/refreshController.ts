import {ApiError} from "../../errros/ApiError";
import {generateToken, saveToken} from "../../helpers/tokenHelper";
import jwt from "jsonwebtoken";
import {Token} from "../../entity/Token";
import {db} from "../../data-source";
import {User} from "../../entity/User";

export const refresh = async (req, res, next) => {
  try {

    const {refreshToken} = req.cookies;
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

    const tokenFromDb = await db.manager.findOneBy(Token, {refreshToken});

    if (!decoded || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await db.manager.findOneBy(User, {id: tokenFromDb.user.id});

    const tokens = generateToken(tokenFromDb.user.id);
    await saveToken(user.id, tokens.refreshToken);

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true
    });
    res.json({tokens, user});
  } catch (e) {
    console.log(e);
    next(e);
  }
};