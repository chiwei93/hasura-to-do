import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { setTokenCookie } from "../../lib/cookie/cookie";

import { getUserByEmail } from "../../lib/graphql/usersDao";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { email, password } = req.body;

      const data = await getUserByEmail(email);

      if (data.users.length === 0) {
        return res.status(400).json({ msg: "Invalid email or password" });
      }

      const hashedPassword = data.users[0].password;

      const match = await bcrypt.compare(password, hashedPassword);

      if (!match) {
        return res.status(400).json({ msg: "Invalid email or password" });
      }

      const user = data.users[0];

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

      setTokenCookie(token, res);

      res.status(200).json({ user: { id: user.id, email: user.email } });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({ msg: err.message });
  }
}
