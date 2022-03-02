import styles from "./FilledBtn.module.css";

export default function FilledBtn({ children, type = "button" }) {
  return (
    <button type={type} className={styles.btn}>
      {children}
    </button>
  );
}
