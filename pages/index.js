import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";

import Container from "../components/Container/Container";
import FilledBtn from "../components/Buttons/FilledBtn/FilledBtn";

import { useAuthContext } from "../context/auth";

import styles from "../styles/Home.module.css";

export default function Home() {
  const { login } = useAuthContext();
  const router = useRouter();

  // states
  const [form, setForm] = useState({
    email: {
      value: "",
      error: "",
    },
    password: {
      value: "",
      error: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

  // for handling input changes
  const onInputChange = (e) => {
    setForm((prevForm) => {
      return {
        ...prevForm,
        [e.target.name]: { value: e.target.value, error: "" },
      };
    });
  };

  // for setting error for each input
  const setFieldError = (field, errMsg) => {
    setForm((prevForm) => {
      return {
        ...prevForm,
        [field]: {
          ...prevForm[field],
          error: errMsg,
        },
      };
    });
  };

  // for resetting the form errors
  const resetError = () => {
    setForm((prevForm) => {
      return {
        email: {
          value: prevForm.email.value,
          error: "",
        },
        password: {
          value: prevForm.password.value,
          error: "",
        },
      };
    });
  };

  // log user in
  const logUserIn = async (email, password) => {
    try {
      setIsLoading(true);

      const res = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });

      if (res.data.user) {
        login();
        router.replace("/lists");
      }
    } catch (err) {
      console.log(err);
      console.log(err.response.data.msg);
      setIsLoading(false);
    }
  };

  // for handling form submission
  const onFormSubmit = (e) => {
    e.preventDefault();

    resetError();

    if (!form.email.value || !form.password.value) {
      if (!form.email.value) {
        setFieldError("email", "Please provide a valid email");
      }

      if (!form.password.value) {
        setFieldError("password", "Please provide a valid password");
      }

      return;
    }

    logUserIn(form.email.value, form.password.value);
  };

  return (
    <Container>
      <Head>
        <title>Login Page</title>
      </Head>

      <form onSubmit={onFormSubmit} className={styles.form}>
        <h1 className={styles.heading}>Login</h1>

        <div className={styles.inputContainer}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email.value}
            onChange={onInputChange}
          />
          {form.email.error && <p>{form.email.error}</p>}
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={form.password.value}
            onChange={onInputChange}
          />
          {form.password.error && <p>{form.password.error}</p>}
        </div>

        <div className={styles.btnContainer}>
          <FilledBtn type="submit">
            {isLoading ? "Logging in" : "Login"}
          </FilledBtn>
        </div>
      </form>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const token = context.req.cookies.jwt_token;

  if (token) {
    return {
      redirect: {
        permanent: true,
        destination: "/lists",
      },
    };
  }

  return {
    props: {},
  };
}
