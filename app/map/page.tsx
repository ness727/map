"use client";

import "ol/ol.css";
import SideBar from "./SideBar";

import { View, Map, Feature } from "ol";
import MainMap from "./MainMap";
import { parseString } from "xml2js";
import React, { useEffect, useRef, useState } from "react";
import { Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as SourceVector } from "ol/source";
import { Draw } from "ol/interaction";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import { XYZ } from "ol/source";

// 벡터 소스 및 레이어 생성
const vectorSource = new VectorSource({
  wrapX: false,
  features: [],
});

// 벡터 레이어 생성
const vectorLayer = new VectorLayer({
  source: vectorSource,
});

// 화면에 도형 그리기
const draw = () =>
  new Draw({
    source: vectorSource,
    type: "LineString",
  });

export default function MapPage() {
  const [map, setMap] = useState<Map>();
  const vectorSourceRef = useRef(new VectorSource());

  const clearLayer = () => {
    vectorSourceRef.current.clear();
  };

  useEffect(() => {
    const initialMap = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new XYZ({
            url: `http://api.vworld.kr/req/wmts/2.0.0/${process.env.NEXT_PUBLIC_VWORLD_API}/Base/{z}/{y}/{x}.png`,
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([127.00169, 37.56421]), // 서울 중심 좌표
        zoom: 13,
      }),
    });

    initialMap.addLayer(vectorLayer);

    setMap(initialMap);

    // 컴포넌트 언마운트 시 맵 정리
    return () => {
      initialMap.setTarget(undefined);
    };
  }, []);

  return (
    <div style={{ display: "flex", position: "relative" }}>
      <SideBar map={map} lineDraw={draw()} clearLayer={clearLayer} />
      <MainMap />
    </div>
  );
}
