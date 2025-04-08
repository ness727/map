"use client";

import { useState } from "react";

import styles from "./SideBar.module.css";
import CloseButton from "./CloseButton";
import SearchBox from "./SearchBox";
import Board from "./Board";

export default function SideBar() {
  const [isClosed, setIsClosed] = useState(false);
  const contentWidth = 400;

  return (
    <div className={styles.outer}>
      <div
        className={styles.container}
        style={{
          width: contentWidth,
          alignSelf: "flex-start",
          display: isClosed ? "none" : "",
        }}
      >
        <div className={styles.title}>찾고 싶은 경로를 입력하세요</div>
        <SearchBox />
        <Board />
        <Board />
        <Board />
        <Board />
      </div>
      <CloseButton isClosed={isClosed} contentWidth={contentWidth} close={() => { setIsClosed(!isClosed) }}  />
    </div>
  );
}
