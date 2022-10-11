import { db } from "../data-source";
import { User } from "../entity/User";

import { ApiError } from "../errros/ApiError";

export const confirmEmail = async (confirmationLink) => {
  const user = await db.manager.findOneBy(User, {
    confirmationLink: confirmationLink,
  });

  if (!user) {
    throw ApiError.BadRequest("Confirmation link is not valid");
  }

  user.emailConfirmed = true;

  await db.manager.save(user);
};
