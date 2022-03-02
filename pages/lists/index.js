import { useState, useEffect } from "react";
import axios from "axios";

import FilledBtn from "../../components/Buttons/FilledBtn/FilledBtn";
import Container from "../../components/Container/Container";
import ListItem from "../../components/ListItem/ListItem";

import { getClientTokenCookie } from "../../lib/cookie/cookie";
import { useAuthContext } from "../../context/auth";

import styles from "../../styles/MyLists.module.css";

export default function MyLists(props) {
  const [form, setForm] = useState({ value: "", error: "" });
  const [isCreating, setIsCreating] = useState(false);
  const [lists, setLists] = useState(props.lists);

  const { login } = useAuthContext();

  // sign user in if there is a token
  useEffect(() => {
    const token = getClientTokenCookie();

    if (token) {
      login();
    }
  }, [login]);

  // handle inputs changes
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

  // reset form error
  const resetError = () => {
    setForm((prevForm) => ({ ...prevForm, error: "" }));
  };

  // for creating new list
  const createList = async (name) => {
    try {
      setIsCreating(true);

      const res = await axios.post("http://localhost:3000/api/lists", {
        name,
      });

      if (res.data) {
        const newList = res.data.list;

        setLists((prevLists) => {
          return [...prevLists, newList];
        });

        setForm({ value: "", error: "" });
      }
    } catch (err) {
      console.log(err);
      console.log(err.message);
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

    createList(form.value);
  };

  // for deleting list
  const deleteList = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/lists/${id}`);

      if (res.data.msg === "List deleted successfully") {
        const listsCopy = [...lists];

        const listIndex = listsCopy.findIndex((list) => list.id === id);

        listsCopy.splice(listIndex, 1);

        setLists(listsCopy);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // for handling delete btn click on each list item
  const onDeleteClick = (listId) => {
    deleteList(listId);
  };

  return (
    <Container>
      <form className={styles.form} onSubmit={onFormSubmit}>
        <h1 className={styles.heading}>Create a new list</h1>

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
          {isCreating ? "Creating..." : "Create new list"}
        </FilledBtn>
      </form>

      <section className={styles.listsSection}>
        <h2 className={styles.listsHeading}>My Lists</h2>

        <ul className={styles.lists}>
          {lists.length === 0 && <p>No lists found</p>}

          {lists.map((list) => {
            return (
              <li key={list.id}>
                <ListItem list={list} onDeleteClick={onDeleteClick} />
              </li>
            );
          })}
        </ul>
      </section>
    </Container>
  );
}

export async function getServerSideProps({ req }) {
  const token = req.cookies.jwt_token;

  if (!token) {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
    };
  }

  const res = await axios.get("http://localhost:3000/api/lists", {
    withCredentials: true,
    headers: {
      Cookie: req.headers.cookie,
    },
  });

  return {
    props: {
      lists: res.data.lists,
    },
  };
}
