import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { checkIfEmailIsTaken, createUser } from "../../lib/graphql/usersDao";
import { setTokenCookie } from "../../lib/cookie/cookie";

const saltRounds = 10;

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { email, password } = req.body;

      // check if email is taken
      const isEmailTaken = await checkIfEmailIsTaken(email);

      if (isEmailTaken) {
        return res.status(400).json({
          msg: "Email is already taken. Please choose another email.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const data = await createUser(email, hashedPassword);

      const user = data.insert_users_one;

      // sign token
      const token = await jwt.sign(
        {
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": `${user.id}`,
          },
        },
        process.env.JWT_SECRET,
        { algorithm: "HS256" }
      );

      // store the token on the header
      setTokenCookie(token, res);

      res.status(201).json({ user });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({ msg: err.message });
  }
}
