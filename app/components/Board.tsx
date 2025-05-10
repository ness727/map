import { Route } from "../map/SideBar";
import styles from "./Board.module.css";

export default function Board({
  content,
  showRoute,
}: {
  content: Route;
  showRoute: (information: [number, number][]) => void;
}) {
  const dateFormat = (date: string) => {
    return date.replace("T", " ").slice(0, 16);
  };

  return (
    <div className={styles.container}>
      <div className={styles.textDiv}>
        <div className={styles.title}>{content.name}</div>
        <div>{content.description}</div>
        <div>{dateFormat(content.createdAt)}</div>
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={styles.button}
          onClick={() => showRoute(content.information)}
        >
          보기
        </button>
      </div>
    </div>
  );
}
