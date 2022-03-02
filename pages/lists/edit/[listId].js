import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import FilledBtn from "../../../components/Buttons/FilledBtn/FilledBtn";
import Container from "../../../components/Container/Container";

import { getClientTokenCookie } from "../../../lib/cookie/cookie";

import { useAuthContext } from "../../../context/auth";

import styles from "../../../styles/EditList.module.css";

export default function EditList(props) {
  const router = useRouter();

  // define states
  const [form, setForm] = useState({ value: props.list.name, error: "" });
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

  // for setting form error
  const setFormError = () => {
    setForm((prevForm) => ({
      ...prevForm,
      error: "Please provide a valid list name",
    }));
  };

  // for resetting form errors
  const resetError = () => {
    setForm((prevForm) => ({
      ...prevForm,
      error: "",
    }));
  };

  // for updating list
  const updateList = async (listName) => {
    try {
      setIsEditing(true);

      const res = await axios.patch(
        `http://localhost:3000/api/lists/${props.list.id}`,
        {
          name: listName,
        }
      );

      if (res.data.list) {
        router.push("/lists");
      }
    } catch (err) {
      console.log(err);
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

    updateList(form.value);
  };

  return (
    <Container>
      <form className={styles.form} onSubmit={onFormSubmit}>
        <h1 className={styles.heading}>Edit List</h1>

        <div className={styles.inputContainer}>
          <label htmlFor="name">Name of list:</label>
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
          {isEditing ? "Editting..." : "Edit list"}
        </FilledBtn>
      </form>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const token = context.req.cookies.jwt_token;

  if (!token) {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
    };
  }

  const { listId } = context.params;

  const res = await axios.get(`http://localhost:3000/api/lists/${listId}`, {
    withCredentials: true,
    headers: { Cookie: context.req.headers.cookie },
  });

  return {
    props: {
      list: res.data.list,
    },
  };
}
