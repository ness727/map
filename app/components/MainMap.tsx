"use client";

import { View, Map, Feature } from "ol";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import { OSM } from "ol/source";
import { useEffect } from "react";
import { Vector as VectorLayer } from "ol/layer";
import { LineString } from "ol/geom";
import VectorSource from "ol/source/Vector";
import { Coordinate } from "ol/coordinate";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";

export default function MainMap({ numArr }: { numArr: number[][] }) {
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

    // 버스 노선 경로 벡터 레이어 추가
    const vectorLayer = getVectorLayer(numArr);
    map.addLayer(vectorLayer);
  }, [numArr]);

  return <div id="map" style={{ width: "100vw", height: "100vh" }}></div>;
}

const getVectorLayer = (numArr: number[][]): VectorLayer => {
  const result: Coordinate[] = [];
  numArr.map((item) => {
    result.push(fromLonLat([item[0], item[1]]));
  });

  // LineString 생성
  const lineString = new LineString(result);

  // Feature 생성
  const lineFeature = new Feature(lineString);

  // 벡터 소스 및 레이어 생성
  const vectorSource = new VectorSource({
    features: [lineFeature],
  });

  // 선 속성 지정
  const strokeStyle = new Style({
    stroke: new Stroke({ color: "rgba(34, 160, 235, 1)", width: 5 }),
  });

  vectorSource.getFeatures().map((feature) => feature.setStyle(strokeStyle));

  // 벡터 레이어 생성
  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  return vectorLayer;
};
