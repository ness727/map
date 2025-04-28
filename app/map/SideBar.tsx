'use client';

import { useEffect, useState } from "react";
import { View, Map } from "ol";
import { GeoJSON } from "ol/format";
import { Draw } from "ol/interaction";

import styles from "./SideBar.module.css";
import CloseButton from "../components/CloseButton";
import SearchBox from "../components/SearchBox";
import Board from "../components/Board";

export default function SideBar({ map, lineDraw, clearLayer }: { map: Map; lineDraw: Draw, clearLayer: () => void }) {
  const [isClosed, setIsClosed] = useState(false);
  const [isDrawBtnClicked, setIsDrawBtnClicked] = useState(false);
  const contentWidth = 400;

  const startDraw = () => {
    map.addInteraction(lineDraw);
    setIsDrawBtnClicked(!isDrawBtnClicked);
  };

  useEffect(() => {
    if (!lineDraw || !map) return;

    const handleDrawEnd = async (event: any) => {
      setIsDrawBtnClicked(false);
      map.removeInteraction(lineDraw);
      clearLayer();

      const feature = event.feature;
      const geojsonFormat = new GeoJSON();
      const geojson = geojsonFormat.writeFeature(feature);

      console.log("GeoJSON:", geojson);

      try {
        const res = await fetch("http://localhost:8080/route", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(geojson),
        });

        if (res.ok) {
          console.log("요청 성공");
        } else {
          console.error("서버 응답 오류", res.status);
        }
      } catch (error) {
        console.error("요청 실패", error);
      }
    };

    lineDraw.on("drawend", handleDrawEnd);

    return () => {
      lineDraw.un("drawend", handleDrawEnd);
    };
  }, [lineDraw, map]);

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
        {
          isDrawBtnClicked 
            ? <h1>마우스 더블 클릭으로 경로를 완성하세요!!</h1>
            : <button className={styles.button} onClick={startDraw}>내 경로 만들기</button>
        }

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
