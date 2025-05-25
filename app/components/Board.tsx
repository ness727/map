import { Route } from "../map/SideBar";
import styles from "./Board.module.css";
import Cookies from "js-cookie";

export default function Board({
  content,
  showRoute,
  moveMap,
  drawPoints,
  deleteRoute,
}: {
  content: Route;
  showRoute: (information: [number, number][]) => void;
  moveMap: () => void;
  drawPoints: (coordinate: [number, number][]) => void;
  deleteRoute: (routeIdx: number, title: string) => void;
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
        <div className={styles.date}>
          추가 일시: {dateFormat(content.createdAt)}
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <div className={styles.innerButtonContainer}>
          <button
            className={styles.viewButton}
            onClick={() => {
              moveMap();
              showRoute(content.information);
              drawPoints(content.information);
            }}
          >
            보기
          </button>
          {Cookies.get("login") !== undefined ? (
            <button
              className={styles.removeButton}
              onClick={() => {
                const confirmed = confirm("정말 삭제하시겠습니까?");
                if (confirmed) deleteRoute(content.routeIdx, content.name);
              }}
            >
              삭제
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
