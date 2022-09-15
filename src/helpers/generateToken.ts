import jwt from "jsonwebtoken";

export const generateToken = (userdId: number) => {
  return jwt.sign(
    {
      userdId,
    },
    process.env.ACCESS_TOKEN,
    {expiresIn: "10d"}
  );
};
