import { getTokenFromCookie } from "../../../lib/cookie/cookie";
import { deleteTaskById, getTaskById, updateTaskNameById } from "../../../lib/graphql/tasksDao";

export default async function handler(req, res) {
  try {
    const token = getTokenFromCookie(req);

    if (!token) {
      return res.status(403).json({ msg: "User not authorized" });
    }

    const { taskId } = req.query;

    const task = await getTaskById(taskId, token);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (req.method === "DELETE") {
      await deleteTaskById(taskId, token);

      res.status(200).json({ msg: "Task deleted successfully" });
    } else if (req.method === "PATCH") {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ msg: "name cannot be empty" });
      }

      const updatedTask = await updateTaskNameById(taskId, name, token)

      res.status(200).json({ task: updatedTask });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({ msg: err.message });
  }
}
