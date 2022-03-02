import { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";

import Container from "../components/Container/Container";
import FilledBtn from "../components/Buttons/FilledBtn/FilledBtn";

import { useAuthContext } from "../context/auth";
import { getTokenFromCookie } from "../lib/cookie/cookie";

import styles from "../styles/Signup.module.css";

export default function Signup() {
  const router = useRouter();
  const { login } = useAuthContext();

  // react states
  const [form, setForm] = useState({
    email: {
      value: "",
      error: null,
    },
    password: {
      value: "",
      error: null,
    },
    confirmPassword: {
      value: "",
      error: null,
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  // set loading after the page is unmounted
  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

  // for handling inputs changes
  const onInputChange = (e) => {
    setForm((prevForm) => {
      return {
        ...prevForm,
        [e.target.name]: { value: e.target.value, error: "" },
      };
    });
  };

  // for setting error of each field
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

  // resetting the errors of the form
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
        confirmPassword: {
          value: prevForm.confirmPassword.value,
          error: "",
        },
      };
    });
  };

  // for signing user in
  const signUserIn = async ({ email, password }) => {
    try {
      setIsLoading(true);

      const res = await axios.post("http://localhost:3000/api/signup", {
        email,
        password,
      });

      if (res.data.user) {
        login();
        router.replace("/lists");
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  // for handling form submission
  const onFormSubmit = (e) => {
    e.preventDefault();

    // reset the form errors
    resetError();

    if (
      !form.email.value ||
      !form.password.value ||
      form.confirmPassword.value !== form.password.value
    ) {
      if (!form.email.value) {
        setFieldError("email", "Please provide a valid email");
      }

      if (!form.password.value) {
        setFieldError("password", "Please provide a valid password");
      }

      if (form.confirmPassword.value !== form.password.value) {
        setFieldError(
          "confirmPassword",
          "The passwords provided does not match"
        );
      }

      return;
    }

    // sign user in
    signUserIn({ email: form.email.value, password: form.password.value });
  };

  return (
    <Container>
      <Head>
        <title>Signup Page</title>
      </Head>

      <form onSubmit={onFormSubmit} className={styles.form}>
        <h1 className={styles.heading}>Sign up</h1>

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

        <div className={styles.inputContainer}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={form.confirmPassword.value}
            onChange={onInputChange}
          />
          {form.confirmPassword.error && <p>{form.confirmPassword.error}</p>}
        </div>

        <div className={styles.btnContainer}>
          <FilledBtn type="submit">
            {isLoading ? "Signing up" : "Sign up"}
          </FilledBtn>
        </div>
      </form>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const token = getTokenFromCookie(context.req);

  // redirect the user to lists page when there is a token
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
