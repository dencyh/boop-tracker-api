import {db} from "./../data-source";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        res.status(403).json({message: "Not authorized"});
        throw new Error("Not authorized");
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
      req.user = decoded;
      next();

      // const userFound = await db.manager.findOneBy(User, {
      //   id: decoded,
      // });

      // if (userFound) {
      //   req.user = userFound;
      //   next();
      // } else {
      //   res.status(401);
      //   throw new Error("Not authorized. Invalid token");
      // }
    } else {
      res.status(403).json({message: "Not authorized"});
    }
  } catch (error) {
    console.log(error);
    return res.status(403).json({message: "Not authorized"});
  }
};
