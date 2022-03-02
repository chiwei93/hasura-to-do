import { getTokenFromCookie } from "../../../lib/cookie/cookie";
import { getUserLists, createList } from "../../../lib/graphql/listsDao";
import { getUserIdFromToken } from "../../../lib/jwt/jwt";

export default async function handler(req, res) {
  try {
    const token = getTokenFromCookie(req);

    if (!token) {
      return res.status(403).json({ msg: "User not authorized" });
    }

    if (req.method === "POST") {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ msg: "name cannot be empty" });
      }

      const userId = await getUserIdFromToken(token);

      if (!userId) {
        return res.status(403).json({ msg: "User not authorized" });
      }

      const data = await createList(name, userId, token);

      const list = data.insert_lists_one;

      res.status(201).json({ list });
    } else if (req.method === "PATCH") {
    } else if (req.method === "GET") {
      const data = await getUserLists(token);

      res.status(200).json({ lists: data.lists });
    }
  } catch (err) {
    console.log(err);
    console.log(err.message);

    res.status(500).json({ msg: err.message });
  }
}
