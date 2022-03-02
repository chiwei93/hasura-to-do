import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import Container from "../../../components/Container/Container";
import FilledBtn from "../../../components/Buttons/FilledBtn/FilledBtn";

import { getTaskById } from "../../../lib/graphql/tasksDao";
import { getClientTokenCookie } from "../../../lib/cookie/cookie";

import { useAuthContext } from "../../../context/auth";

import styles from "../../../styles/EditTask.module.css";

export default function EditTask({ task }) {
  const router = useRouter();

  // define states
  const [form, setForm] = useState({ value: task.name, error: "" });
  const [isEditing, setIsEditing] = useState(false);

  const { login } = useAuthContext();

  useEffect(() => {
    const token = getClientTokenCookie();

    if (token) {
      login();
    }

    return () => {
      setIsEditing(false);
    };
  }, [login]);

  // for handling input changes
  const onInputChange = (e) => {
    setForm((prevForm) => ({ ...prevForm, value: e.target.value }));
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

  // for editing task
  const editTask = async (name) => {
    try {
      setIsEditing(true);

      const res = await axios.patch(
        `http://localhost:3000/api/tasks/${task.id}`,
        { name }
      );

      if (res.data.task) {
        router.push(`/lists/${res.data.task.list.id}`);
      }
    } catch (err) {
      console.log(err);
      console.log(err.response.data);
      setIsEditing(false);
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

    editTask(form.value);
  };

  return (
    <Container>
      <form className={styles.form} onSubmit={onFormSubmit}>
        <h1 className={styles.heading}>Edit Task</h1>

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
          {isEditing ? "Editing..." : "Edit Task"}
        </FilledBtn>
      </form>
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

  const { taskId } = params;

  const task = await getTaskById(taskId, token);

  if (!task) {
    return {
      redirect: {
        permanent: true,
        destination: "/lists",
      },
    };
  }

  return {
    props: { task },
  };
}
