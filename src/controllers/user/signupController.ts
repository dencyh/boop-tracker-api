import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { v4 as uuid } from "uuid";

import { db } from "../../data-source";
import { User } from "../../entity/User";
import { ApiError } from "../../errros/ApiError";
import { generateToken, saveToken } from "../../helpers/tokenHelper";

const sendConfirmationEmail =
  require("../../helpers/sendConfirmationEmail.ts").sendConfirmationEmail;

export const signUp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest("Validation error", errors.array()));
    }

    const { first_name, last_name, email, password } = req.body;

    const userExists = await db.manager.findOneBy(User, {
      email,
    });

    if (userExists) {
      throw ApiError.BadRequest("email already used");
    }

    const user = new User();

    user.email = email;
    user.password = bcrypt.hashSync(password, 5);
    user.first_name = first_name;
    user.last_name = last_name;

    user.confirmation_link = uuid();

    const newUser = await db.manager.save(user);
    await sendConfirmationEmail(newUser);

    const tokens = generateToken(newUser.id);
    await saveToken(newUser, tokens.refreshToken);

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.json({ newUser, tokens });
  } catch (err) {
    next(err);
  }
};
