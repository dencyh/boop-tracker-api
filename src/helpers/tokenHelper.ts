import jwt from "jsonwebtoken";
import { User } from "../entity/User";

import { db } from "./../data-source";
import { Token } from "./../entity/Token";

export const saveToken = async (user: User, refreshToken: string) => {
  const tokenRepo = db.getRepository(Token);
  const tokenFound = await tokenRepo.findOne({
    relations: {
      user: true,
    },
    where: {
      user: {
        id: user.id,
      },
    },
  });
  if (tokenFound) {
    await db.manager.update(Token, tokenFound.id, { refreshToken });
    // tokenFound.refreshToken = refreshToken;
    return;
  }
  const token = new Token();
  token.refreshToken = refreshToken;
  token.user = user;

  const newToken = await db.manager.save(token);
  return newToken;
};

export const removeToken = async (refreshToken) => {
  const tokenRepo = db.getRepository(Token);
  const token = await tokenRepo.delete({ refreshToken });
  return token;
};

export const generateToken = (userId: number) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN, {
    expiresIn: "10d",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};
