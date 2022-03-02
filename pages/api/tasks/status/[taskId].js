import { getTokenFromCookie } from "../../../../lib/cookie/cookie";
import {
  getTaskById,
  updateTaskCompletedById,
} from "../../../../lib/graphql/tasksDao";

export default async function handler(req, res) {
  try {
    const token = getTokenFromCookie(req);

    if (!token) {
      return res.status(403).json({ msg: "User not authorized" });
    }

    if (req.method === "PATCH") {
      const { taskId } = req.query;

      const task = await getTaskById(taskId, token);

      if (!task) {
        return res.status(404).json({ msg: "Task not found" });
      }

      const updatedTask = await updateTaskCompletedById(
        taskId,
        !task.completed,
        token
      );

      res.status(200).json({ task: updatedTask });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({ msg: err.message });
  }
}
