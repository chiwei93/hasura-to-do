import Link from "next/link";

import Logo from "../Logo/Logo";

import { useAuthContext } from "../../context/auth";

import styles from "./Footer.module.css";

export default function Footer() {
  const { isSignedIn } = useAuthContext();

  return (
    <footer className={styles.footer}>
      <Logo />

      {isSignedIn && (
        <ul className={styles.navList}>
          <li>
            <Link href="/lists">
              <a className={styles.navLink}>My Lists</a>
            </Link>
          </li>
        </ul>
      )}
    </footer>
  );
}
