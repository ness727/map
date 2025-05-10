"use client";

import "ol/ol.css";
import SideBar from "./SideBar";

import { View, Map } from "ol";
import MainMap from "./MainMap";
import React, { useCallback, useEffect, useState } from "react";
import { Vector as VectorLayer } from "ol/layer";
import { Draw } from "ol/interaction";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import { XYZ } from "ol/source";
import Modal from "../components/RouteSaveModal";
import Input from "./Input";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import { useRouter } from "next/navigation";

interface SaveFormat {
  categoryIdx: string;
  name: string;
  information: [];
  description: string;
}

export default function MapPage() {
  const [map, setMap] = useState<Map | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [route, setRoute] = useState<[]>([]);
  const [saveDate, setSaveData] = useState<SaveFormat>({
    categoryIdx: "",
    name: "",
    information: [],
    description: "",
  });

  // 벡터 소스 및 레이어 생성
  const vectorSource = new VectorSource({
    wrapX: false,
    features: [],
  });

  // 스타일: 외곽선 (outline) 효과
  const outlineStyle = new Style({
    stroke: new Stroke({
      color: "white", // 외곽선 색상
      width: 8, // 외곽선 두께
    }),
  });

  // 선 스타일 지정
  const lineStyle = new Style({
    stroke: new Stroke({
      color: "#0056b3",
      width: 5,
    }),
  });

  // 벡터 레이어 생성
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: [outlineStyle, lineStyle],
  });

  // 화면에 도형 그리기
  const draw = () =>
    new Draw({
      source: vectorSource,
      type: "LineString",
    });

  const clearLayer = () => {
    if (map != null) {
      const layers = map.getLayers().getArray();
      const vectorLayer = layers.find(
        (layer) => layer instanceof VectorLayer
      ) as VectorLayer<VectorSource>;

      if (vectorLayer) {
        const source = vectorLayer.getSource();
        source?.clear();
      } else {
        console.error("벡터레이어 조회 오류");
      }
    }
  };

  const onOpen = useCallback(() => {
    setIsModalOpen(true);
  }, [isModalOpen]);

  const changeRoute = useCallback(
    (coords: []) => {
      setRoute(coords);
    },
    [route]
  );

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

  const saveRoute = async () => {
    try {
      saveDate.information = route;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/api/v1/routes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(saveDate),
        }
      );

      if (res.ok) {
        console.log("요청 성공");
      } else {
        console.error("서버 응답 오류", res.status);
      }

      setSaveData({
        categoryIdx: "",
        name: "",
        information: [],
        description: "",
      });
    } catch (error) {
      console.error("요청 실패", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {map && (
        <SideBar
          map={map}
          lineDraw={draw()}
          clearLayer={clearLayer}
          onOpen={onOpen}
          changeRoute={changeRoute}
        />
      )}

      <div id="map" style={{ width: "100vw", height: "100vh" }}></div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h1>나의 경로 저장하기</h1>
        <br />
        <div>
          <Input
            id="categoryIdx"
            value={saveDate.categoryIdx}
            onChange={(e) => {
              setSaveData((prev) => ({
                ...prev,
                categoryIdx: e.target.value,
              }));
            }}
          >
            카테고리 선택
          </Input>
          <Input
            id="name"
            value={saveDate.name}
            onChange={(e) => {
              setSaveData((prev) => ({
                ...prev,
                name: e.target.value,
              }));
            }}
          >
            경로명
          </Input>
          <Input
            id="description"
            value={saveDate.description}
            onChange={(e) => {
              setSaveData((prev) => ({
                ...prev,
                description: e.target.value,
              }));
            }}
          >
            설명
          </Input>
        </div>

        <button
          onClick={() => {
            setIsModalOpen(false);
            saveRoute();
          }}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            backgroundColor: "#0056b3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          저장
        </button>
      </Modal>
    </div>
  );
}
