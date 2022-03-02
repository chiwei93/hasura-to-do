import { useState, useEffect } from "react";
import axios from "axios";

import FilledBtn from "../../components/Buttons/FilledBtn/FilledBtn";
import Container from "../../components/Container/Container";
import TaskItem from "../../components/TaskItem/TaskItem";

import { getTaskByListId } from "../../lib/graphql/tasksDao";
import { getUserIdFromToken } from "../../lib/jwt/jwt";
import { getClientTokenCookie } from "../../lib/cookie/cookie";

import { useAuthContext } from "../../context/auth";

import styles from "../../styles/SingleList.module.css";

export default function SingleList(props) {
  // define states
  const [form, setForm] = useState({ value: "", error: "" });
  const [tasks, setTasks] = useState(props.tasks);
  const [isCreating, setIsCreating] = useState(false);

  const { login } = useAuthContext();

  useEffect(() => {
    const token = getClientTokenCookie();

    if (token) {
      login();
    }
  }, [login]);

  // for handling inputs changes
  const onInputChange = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      value: e.target.value,
    }));
  };

  // for setting form errors
  const setFormError = () => {
    setForm((prevForm) => ({
      ...prevForm,
      error: "Please provide a valid task name",
    }));
  };

  // for resetting form errors
  const resetError = () => {
    setForm((prevForm) => ({
      ...prevForm,
      error: "",
    }));
  };

  // for creating task
  const createTask = async (taskName) => {
    try {
      setIsCreating(true);

      const res = await axios.post("http://localhost:3000/api/tasks", {
        name: taskName,
        listId: props.listId,
      });

      setTasks((prevTasks) => {
        return [...prevTasks, res.data.task];
      });

      setForm({ value: "", error: "" });
    } catch (err) {
      console.log(err);
      console.log(err.response.data);
    } finally {
      setIsCreating(false);
    }
  };

  // for handling form submission
  const onFormSubmit = (e) => {
    e.preventDefault();

    resetError();

    if (!form.value) {
      setFormError();
      return;
    }

    createTask(form.value);
  };

  // for toggling task status
  const toggleStatus = async (id) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/tasks/status/${id}`
      );

      const { task } = res.data;

      const tasksCopy = [...tasks];

      const taskIndex = tasksCopy.findIndex((t) => t.id === task.id);

      tasksCopy[taskIndex].completed = task.completed;

      setTasks(tasksCopy);
    } catch (err) {
      console.log(err);
    }
  };

  // for handling status btn click
  const onStatusClick = (taskId) => {
    toggleStatus(taskId);
  };

  // for deleting task
  const deleteTask = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/tasks/${id}`);

      if (res.data.msg === "Task deleted successfully") {
        const tasksCopy = [...tasks];

        const taskIndex = tasksCopy.findIndex((t) => t.id === id);
        tasksCopy.splice(taskIndex, 1);

        setTasks(tasksCopy);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // for handling delete btn click
  const onDeleteClick = (taskId) => {
    deleteTask(taskId);
  };

  return (
    <Container>
      <form className={styles.form} onSubmit={onFormSubmit}>
        <h1 className={styles.heading}>Create task</h1>

        <div className={styles.inputContainer}>
          <label htmlFor="name">Name of task:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={form.value}
            onChange={onInputChange}
          />

          {form.error && <p>{form.error}</p>}
        </div>

        <FilledBtn type="submit">
          {isCreating ? "Creating..." : "Create new task"}
        </FilledBtn>
      </form>

      <section className={styles.listsSection}>
        <h2 className={styles.listsHeading}>My Tasks</h2>

        <ul className={styles.lists}>
          {tasks.length === 0 && <p>No tasks found</p>}

          {tasks.map((task) => {
            return (
              <li key={task.id}>
                <TaskItem
                  task={task}
                  onDeleteClick={onDeleteClick}
                  onStatusClick={onStatusClick}
                />
              </li>
            );
          })}
        </ul>
      </section>
    </Container>
  );
}

export async function getServerSideProps({ req, params }) {
  const token = req.cookies.jwt_token;

  if (!token) {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
    };
  }

  const { listId } = params;

  const userId = await getUserIdFromToken(token);

  const list = await getTaskByListId(listId, token);

  if (!list) {
    return {
      redirect: {
        permanent: true,
        destination: "/lists",
      },
    };
  }

  if (parseFloat(userId) !== parseFloat(list.user.id)) {
    return {
      redirect: {
        permanent: true,
        destination: "/lists",
      },
    };
  }

  return {
    props: {
      tasks: list.tasks,
      listId: list.id,
    },
  };
}
