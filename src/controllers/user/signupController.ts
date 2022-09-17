import {generateToken} from "../../helpers/generateToken";
import {User} from "../../entity/User";
import {db} from "../../data-source";
import bcrypt from "bcrypt";
import {validationResult} from "express-validator";

export const signupUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({message: "An error occured while singup", errors});
    }

    const {first_name, last_name, email, password} = req.body;

    const userExists = await db.manager.findOneBy(User, {
      email,
    });

    if (userExists) {
      res.status(400).json({message: "An account with this email address already exists."});
      throw new Error("An account with this email address already exists.");
    }

    const user = new User();

    user.email = email;
    user.password = bcrypt.hashSync(password, 5);
    user.first_name = first_name;
    user.last_name = last_name;

    const newUser = await db.manager.save(user);
    console.log(newUser);

    const token = generateToken(newUser.id);

    res.json({newUser, token});
  } catch (err) {
    console.error(err);
  }
};
