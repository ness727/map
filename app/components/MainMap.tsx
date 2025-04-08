"use client";

import { View, Map, Feature } from "ol";
import { GeoJSON } from "ol/format";
import { Draw } from "ol/interaction";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import { OSM } from "ol/source";
import { useEffect, useState } from "react";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as SourceVector } from "ol/source";
import { LineString, Point } from "ol/geom";
import VectorSource from "ol/source/Vector";
import { Coordinate } from "ol/coordinate";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Icon from "ol/style/Icon";

import styles from './MainMap.module.css'

export default function MainMap({
  busRoutePosArr,
  busPosArr,
}: {
  busRoutePosArr: number[][];
  busPosArr: number[][];
}) {
  const [map, setMap] = useState<Map>(new Map());

  useEffect(() => {
    const initialMap = new Map({
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
    setMap(initialMap);

    // 컴포넌트 언마운트 시 맵 정리
    return () => {
      initialMap.setTarget(undefined);
    };
  }, []);

  useEffect(() => {
    // 버스 노선 경로 벡터 레이어 추가
    const busRouteLayer = getBusRouteVectorLayer(busRoutePosArr);
    map.addLayer(busRouteLayer);

    // 버스 위치 마커 레이어 추가
    busPosArr.map((busPos) => {
      const busPosMarkerLayer = getBusPosMarkerLayer(busPos);
      map.addLayer(busPosMarkerLayer);
    });
  }, [busPosArr, busRoutePosArr, map]);

  // 벡터 소스 및 레이어 생성
  const vectorSource = new SourceVector({
    wrapX: false,
    features: [],
  });

  // 벡터 레이어 생성
  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });
  map.addLayer(vectorLayer);

  // 화면에 도형 그리기
  const drawVectorLayer = () => {
    const lineDraw = new Draw({
      source: vectorSource,
      type: "LineString",
    });
    map.addInteraction(lineDraw);
  };

  const saveVectorLayer = () => {
    console.log(
      new GeoJSON().writeFeatures(vectorLayer?.getSource().getFeatures())
    );
  };

  return (
    <>
      <div className={styles.buttonBox}>
        {/* <button onClick={drawVectorLayer}>그리기</button>
        <button onClick={saveVectorLayer}>저장</button> */}
      </div>
      <div id="map" style={{ width: "100vw", height: "100vh"}}></div>
    </>
  );
}

// 버스 노선 경로 벡터 레이어
const getBusRouteVectorLayer = (busRoutePosArr: number[][]): VectorLayer => {
  const coordinateArr: Coordinate[] = [];
  busRoutePosArr.map((item) => {
    coordinateArr.push(fromLonLat([item[0], item[1]]));
  });

  // LineString 생성
  const lineString = new LineString(coordinateArr);

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

// 버스 위치 마커 레이어
const getBusPosMarkerLayer = (busPos: number[]): VectorLayer => {
  // Point 생성
  const point = new Point(fromLonLat([busPos[0], busPos[1]]));

  // Feature 생성
  const pointFeature = new Feature(point);

  // 벡터 소스 및 레이어 생성
  const vectorSource = new SourceVector({
    features: [pointFeature],
  });

  // 마커 속성 지정
  const markerStyle = new Style({
    image: new Icon({
      opacity: 1,
      scale: 1.2,
      src: "http://map.vworld.kr/images/ol3/marker_blue.png",
    }),
    zIndex: 100,
  });

  // vectorSource.getFeatures().map((feature) => feature.setStyle(markerStyle));

  // 벡터 레이어 생성
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: markerStyle,
  });

  return vectorLayer;
};
