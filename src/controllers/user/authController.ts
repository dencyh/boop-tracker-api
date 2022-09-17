import {generateToken} from "../../helpers/generateToken";
import bcrypt from "bcrypt";
import {User} from "../../entity/User";
import {db} from "../../data-source";
import {validationResult} from "express-validator";

export const authUser = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({message: "An error occured while singup", errors});
    // }

    const {email, password} = req.body;
    const user = await db.manager.findOneBy(User, {email});

    if (!user) {
      return res.status(400).json({message: "Couldn't find an account matching the email"});
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({message: "Wrong password"});
    }
    const token = generateToken(user.id);
    return res.json({token});
  } catch (err) {
    console.log(err);
    res.status(400).json({message: "Login error"});
  }
};
