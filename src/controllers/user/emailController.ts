import { confirmEmail } from "./../../helpers/confirmEmail";

export const emailController = async (req, res, next) => {
  try {
    const confirmationLink = req.params.link;
    await confirmEmail(confirmationLink);
    return res.redirect(process.env.CLIENT_URL);
  } catch (err) {
    next(err);
  }
};
