import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faCheck,
  faMinus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./TaskItem.module.css";
import OutlineBtn from "../Buttons/OutlineBtn/OutlineBtn";

export default function TaskItem({ task, onDeleteClick, onStatusClick }) {
  // for rendering status button
  const renderStatusBtn = () => {
    if (task.completed) {
      return (
        <OutlineBtn
          type="button"
          borderColor="orangered"
          color="orangered"
          onClick={() => onStatusClick(task.id)}
        >
          <FontAwesomeIcon icon={faMinus} />
        </OutlineBtn>
      );
    } else {
      return (
        <OutlineBtn
          type="button"
          borderColor="limegreen"
          color="limegreen"
          onClick={() => onStatusClick(task.id)}
        >
          <FontAwesomeIcon icon={faCheck} />
        </OutlineBtn>
      );
    }
  };

  // for handling on delete btn click
  const onDeleteBtnClick = () => {
    onDeleteClick(task.id);
  };

  return (
    <article className={styles.task}>
      <span>{task.name}</span>

      <ul className={styles.list}>
        <li>{renderStatusBtn()}</li>

        <li>
          <OutlineBtn type="link" href={`/items/edit/${task.id}`}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </OutlineBtn>
        </li>

        <li>
          <OutlineBtn
            type="button"
            borderColor="orangered"
            color="orangered"
            onClick={onDeleteBtnClick}
          >
            <FontAwesomeIcon icon={faTrash} />
          </OutlineBtn>
        </li>
      </ul>
    </article>
  );
}
