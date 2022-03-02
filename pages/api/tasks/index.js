import { getTokenFromCookie } from "../../../lib/cookie/cookie";
import { createTask } from "../../../lib/graphql/tasksDao";

export default async function handler(req, res) {
  const token = getTokenFromCookie(req);

  if (!token) {
    return res.status(403).json({ msg: "User not authorized" });
  }

  try {
    if (req.method === "POST") {
      const { name, listId } = req.body;

      if (!name || !listId) {
        const errArr = [];

        if (!name) {
          errArr.push("name cannot be empty");
        }

        if (!listId) {
          errArr.push("listId cannot be empty");
        }

        return res.status(400).json({ msg: errArr.join(", ") });
      }

      const task = await createTask(name, listId, token);

      res.status(201).json({ task });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({ msg: err.message });
  }
}
