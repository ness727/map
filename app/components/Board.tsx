  import { Route } from "../map/SideBar";
  import styles from "./Board.module.css";

  export default function Board({
    content,
    showRoute,
    moveMap
  }: {
    content: Route;
    showRoute: (information: [number, number][]) => void;
    moveMap: () => void;
  }) {
    const dateFormat = (date: string) => {
      return date.replace("T", " ").slice(0, 16);
    };

    return (
      <div className={styles.container}>
        <div className={styles.textDiv}>
          <div className={styles.title}>{content.name}</div>
          <hr />
          <div className={styles.category}>{content.categoryName}</div>
          <div>거리 - {content.distance}km</div>
          <div>{content.description}</div>
          <div className={styles.date}>추가 일시: {dateFormat(content.createdAt)}</div>
        </div>
        <div className={styles.buttonContainer}>
          <button
            className={styles.button}
            onClick={() => {
                moveMap();
                showRoute(content.information);
              }}
          >
            보기
          </button>
        </div>
      </div>
    );
  }
