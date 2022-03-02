import Link from "next/link";

import styles from "./OutlineBtn.module.css";

export default function OutlineBtn({
  type = "button",
  children,
  href,
  borderColor = "#845ec2",
  color = "#845ec2",
  onClick = () => {},
}) {
  if (type === "button" || type === "submit") {
    return (
      <button
        className={styles.btn}
        style={{ borderColor, color }}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }

  if (type === "link") {
    return (
      <Link href={href}>
        <a
          className={styles.btn}
          style={{ borderColor, color }}
          onClick={onClick}
        >
          {children}
        </a>
      </Link>
    );
  }
}
