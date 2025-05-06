import { Route } from "../map/SideBar";
import styles from "./Board.module.css";

export default function Board({ content }: { content: Route }) {
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
      <div>
        <button>보기</button>
      </div>
    </div>
  );
}
