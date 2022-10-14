import { removeToken } from "./../../helpers/tokenHelper";

export const signOut = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { refreshToken } = req.cookies;

    const token = await removeToken(refreshToken);
    res.clearCookie("refreshToken");
    return res.json(token);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
