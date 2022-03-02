import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";

import Logo from "../Logo/Logo";

import { useAuthContext } from "../../context/auth";

import styles from "./Navbar.module.css";

export default function Navbar() {
  const { isSignedIn, logout } = useAuthContext();

  const router = useRouter();

  const onLogoutBtnClick = async () => {
    try {
      await axios.get("http://localhost:3000/api/logout");

      logout();
      router.replace("/");
    } catch (err) {
      console.log(err);
      console.log(err.response.data.message);
    }
  };

  return (
    <nav className={styles.navbar}>
      <Logo />

      <ul className={styles.navList}>
        {!isSignedIn && router.pathname !== "/" && (
          <li>
            <Link href="/">
              <a className={styles.navLink}>Login</a>
            </Link>
          </li>
        )}
        {!isSignedIn && router.pathname !== "/signup" && (
          <li>
            <Link href="/signup">
              <a className={styles.navLink}>Signup</a>
            </Link>
          </li>
        )}
        {isSignedIn && (
          <li>
            <Link href="/lists">
              <a className={styles.navLink}>My Lists</a>
            </Link>
          </li>
        )}
        {isSignedIn && (
          <li>
            <button className={styles.navLink} onClick={onLogoutBtnClick}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
