import jwt from "jsonwebtoken";

import { db } from "./../data-source";
import { ApiError } from "../errros/ApiError";

export const authMiddleware = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return next(ApiError.UnauthorizedError());
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
      if (!decoded) {
        return next(ApiError.UnauthorizedError());
      }
      req.user = decoded;
      next();
    } else {
      return next(ApiError.UnauthorizedError());
    }
  } catch (e) {
    console.log(e);
    next(ApiError.UnauthorizedError());
  }
};
