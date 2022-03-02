import Link from "next/link";

import styles from "./Logo.module.css";

export default function Logo() {
  return (
    <div>
      <Link href="/">
        <a className={styles.logo}>Hasura ToDoApp</a>
      </Link>
    </div>
  );
}
