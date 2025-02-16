"use client";

import "ol/ol.css";
import TileLayer from "ol/layer/Tile";
import { Map, View } from "ol";
import OSM from "ol/source/OSM";
import Style from "ol/style/Style";
import { Circle } from "ol/geom";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import { fromLonLat } from "ol/proj";
import { useEffect } from "react";
import SideBar from "../components/SideBar";

import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { LineString } from "ol/geom";
import Feature from "ol/Feature";

export default function MainMap() {
  useEffect(() => {
    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([127.00169, 37.56421]), // 서울 중심 좌표
        zoom: 13,
      }),
    });

    // 경로 좌표 데이터
    const routeCoordinates = [
      fromLonLat([127.00169, 37.56421]), // 시작점
      fromLonLat([127.005, 37.565]), // 중간점
      fromLonLat([127.01, 37.57]), // 끝점
    ];

    // LineString 생성
    const lineString = new LineString(routeCoordinates);

    // Feature 생성
    const lineFeature = new Feature(lineString);

    // 벡터 소스 및 레이어 생성
    const vectorSource = new VectorSource({
      features: [lineFeature],
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // 지도에 벡터 레이어 추가
    map.addLayer(vectorLayer);
  }, []);

  return (
    <div style={{ display: "flex", position: "relative" }}>
      <SideBar />
      <div id="map" style={{ width: "100vw", height: "100vh" }}></div>
    </div>
  );
}
