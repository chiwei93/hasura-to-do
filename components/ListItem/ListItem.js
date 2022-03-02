import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faEllipsis,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./ListItem.module.css";
import OutlineBtn from "../Buttons/OutlineBtn/OutlineBtn";

export default function ListItem({ list, onDeleteClick }) {
  // for handling delete btn click
  const onDeleteBtnClick = () => {
    onDeleteClick(list.id);
  };

  return (
    <article className={styles.listItem}>
      <span>{list.name}</span>

      <ul className={styles.list}>
        <li>
          <OutlineBtn type="link" href={`/lists/edit/${list.id}`}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </OutlineBtn>
        </li>

        <li>
          <OutlineBtn type="link" href={`/lists/${list.id}`}>
            <FontAwesomeIcon icon={faEllipsis} />
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
