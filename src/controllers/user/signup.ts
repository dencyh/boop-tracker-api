import {generateToken} from "./../../helpers/generateToken";
import {User} from "../../entity/User";
import {db} from "./../../data-source";

export const signupUser = async (req, res) => {
  try {
    const {email, password} = req.body;

    const userExists = await db.manager.findOneBy(User, {
      email,
    });

    if (userExists) {
      res.status(400);
      throw new Error("An account with this email address already exists.");
    }

    const user = new User();
    user.email = email;
    user.password = password;

    const newUser = await db.manager.save(user);
    console.log(newUser);

    const token = generateToken(newUser.id);

    console.log(token);
    res.json({newUser, token});
  } catch (err) {
    console.log(err);
  }
};
