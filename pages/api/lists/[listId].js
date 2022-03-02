import { getTokenFromCookie } from "../../../lib/cookie/cookie";
import {
  deleteListById,
  getListById,
  updateListNameById,
} from "../../../lib/graphql/listsDao";
import { getUserIdFromToken } from "../../../lib/jwt/jwt";

export default async function handler(req, res) {
  try {
    const token = getTokenFromCookie(req);

    if (!token) {
      return res.status(403).json({ msg: "User not authorized" });
    }

    const userId = await getUserIdFromToken(token);

    const { listId } = req.query;

    if (req.method === "PATCH") {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ msg: "name cannot be empty" });
      }

      const listData = await getListById(listId, token);

      const listFound = listData.lists_by_pk;

      if (!listFound) {
        return res.status(404).json({ msg: "List not found" });
      }

      if (parseFloat(userId) !== parseFloat(listFound.user.id)) {
        return res.status(403).json({ msg: "User not authorized" });
      }

      const updatedData = await updateListNameById(listId, name, token);

      const list = updatedData.update_lists_by_pk;

      res.status(200).json({ list });
    } else if (req.method === "GET") {
      const data = await getListById(listId, token);

      const list = data.lists_by_pk;

      if (!list) {
        return res.status(404).json({ msg: "List not found" });
      }

      if (parseFloat(userId) !== parseFloat(list.user.id)) {
        return res.status(403).json({ msg: "User not authorized" });
      }

      res.status(200).json({ list });
    } else if (req.method === "DELETE") {
      const data = await getListById(listId, token);

      const list = data.lists_by_pk;

      if (!list) {
        return res.status(404).json({ msg: "List not found" });
      }

      if (parseFloat(userId) !== parseFloat(list.user.id)) {
        return res.status(403).json({ msg: "User not authorized" });
      }

      await deleteListById(listId, token);

      res.status(200).json({ msg: "List deleted successfully" });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({ msg: err.message });
  }
}
