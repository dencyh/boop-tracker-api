import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { v4 as uuid } from "uuid";

import { db } from "../../data-source";
import { User } from "../../entity/User";
import { ApiError } from "../../errros/ApiError";
import { generateToken, saveToken } from "../../helpers/tokenHelper";

const sendConfirmationEmail =
  require("../../helpers/sendConfirmationEmail.ts").sendConfirmationEmail;

export const updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest("Validation error", errors.array()));
    }

    const { id } = req.params;
    const { firstName, lastName, email, password } = req.body;

    const user = await db.manager.findOneBy(User, {
      id,
    });

    if (!user) {
      throw ApiError.BadRequest("user not found");
    }

    if (user.email === "ljmfvd@gmail.com") {
      throw ApiError.BadRequest(
        "You cannot change test user details. Create an account if you want to use this functionality"
      );
    }

    const emailChanged = user.email !== email;
    if (emailChanged) {
      const usersWithEmail = await db.manager.findOneBy(User, {
        email,
      });

      if (usersWithEmail?.id) {
        throw ApiError.BadRequest("Email is already taken");
      }
      user.emailConfirmed = false;
      user.confirmationLink = uuid();
    }

    const oldPassword = bcrypt.compareSync(password, user.password);
    if (
      oldPassword !== password &&
      password &&
      user.email !== "ljmfvd@gmail.com"
    ) {
      user.password = bcrypt.hashSync(password, 5);
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;

    const updatedUser = await db.manager.save(user);

    if (emailChanged) {
      sendConfirmationEmail(updatedUser);
    }

    const tokens = generateToken(updatedUser.id);
    await saveToken(updatedUser, tokens.refreshToken);

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({ updatedUser, tokens });
  } catch (err) {
    next(err);
  }
};
