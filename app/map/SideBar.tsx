"use client";

import { useEffect, useState } from "react";
import { Feature, Map } from "ol";
import { GeoJSON } from "ol/format";
import { Draw } from "ol/interaction";
import { getLength } from 'ol/sphere';

import styles from "./SideBar.module.css";
import CloseButton from "../components/CloseButton";
import SearchBox from "../components/SearchBox";
import Board from "../components/Board";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fromLonLat, transform } from "ol/proj";
import { LineString, Point } from "ol/geom";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Modal from "../components/RouteSaveModal";
import Input from "./Input";
import Select from "./Select";
import Cookies from "js-cookie";

interface SaveFormat {
  categoryIdx: string;
  name: string;
  information: [];
  description: string;
  distance: number;
}

export type Route = {
  routeIdx: number;
  userIdx: number;
  categoryIdx: number;
  categoryName: string;
  name: string;
  information: [number, number][];
  description: string;
  distance: number;
  createdAt: string;
  updatedAt: string | null;
};

export type RouteResponse = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: Route[];
};

type ComboType = {
  categoryIdx: number;
  name: string;
};

export default function SideBar({
  map,
  lineDraw,
  clearLayer,
  route,
  changeRoute,
}: {
  map: Map;
  lineDraw: Draw;
  clearLayer: () => void;
  route: [];
  changeRoute: (route: []) => void;
}) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState<string>(
    searchParams.get("name") ?? ""
  );
  const [data, setData] = useState<RouteResponse | null>(null); // 검색 결과 데이터

  const [isClosed, setIsClosed] = useState(false);
  const [isDrawBtnClicked, setIsDrawBtnClicked] = useState(false);
  const contentWidth = 400;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryIdx, setCategoryIdx] = useState(0);
  const [saveData, setSaveData] = useState<SaveFormat>({
    categoryIdx: "",
    name: "",
    information: [],
    description: "",
    distance: 0.1,
  });

  const [comboData, setComboData] = useState<ComboType[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((body) => {
        body.json().then((json) => {
          setComboData(json);
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/api/v1/routes` +
        `?categoryIdx=${categoryIdx}&name=${keyword}`, {
          credentials: "include",
        }
    )
      .then((res) => res.json())
      .then((json: RouteResponse) => {
        setData(json);
        console.log(data);
      })
      .catch((err) => {
        console.error("Error fetching routes:", err);
      });
    router.replace(pathName);
  }, [categoryIdx])

  const startDraw = () => {
    map.addInteraction(lineDraw);
    setIsDrawBtnClicked(!isDrawBtnClicked);
  };

  const saveRoute = async () => {
    try {
      saveData.information = route;

      const line = new LineString(saveData.information);

      // 거리 계산 (단위: meter)
      const length = getLength(line, {projection: 'EPSG:4326'}) / 1000;
      console.log(`거리: ${length.toFixed(2)} km`);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/api/v1/routes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...saveData, distance: length.toFixed(2) }),
          credentials: "include",
        }
      );

      if (res.ok) {
        console.log("요청 성공");
      } else {
        console.error("서버 응답 오류", res.status);
      }

      setKeyword(saveData.name);
      setSaveData({
        categoryIdx: "",
        name: "",
        information: [],
        description: "",
        distance: 0.1,
      });
    } catch (error) {
      console.error("요청 실패", error);
    }
  };

  const showRoute = (information: [number, number][]) => {
    clearLayer();

    const lineCoordinates = information.map((coord) => fromLonLat(coord));
    const lineString = new LineString(lineCoordinates);
    const feature = new Feature({ geometry: lineString });

    const layers = map.getLayers().getArray();
    const vectorLayer = layers.find(
      (layer) => layer instanceof VectorLayer
    ) as VectorLayer<VectorSource>;

    if (vectorLayer) {
      const source = vectorLayer.getSource();
      source?.addFeature(feature);
    } else {
      console.error("벡터레이어 조회 오류");
    }
  };

  const moveMap = (xy: [number, number]) => {
    map
      .getView()
      .setCenter(
        new Point(xy).transform("EPSG:4326", "EPSG:3857").getCoordinates()
      );
  };

  useEffect(() => {
    if (!lineDraw || !map) return;

    const handleDrawEnd = async (event: any) => {
      setIsDrawBtnClicked(false);
      map.removeInteraction(lineDraw);
      clearLayer();
      // onOpen();
      setIsModalOpen(true);

      const feature = event.feature;
      const geojsonFormat = new GeoJSON();
      const geojson = geojsonFormat.writeFeature(feature);

      const geoObject = JSON.parse(geojson);

      console.log("GeoJSON:", geojson);

      const transformed = geoObject.geometry.coordinates.map((item: any) =>
        transform(item, "EPSG:3857", "EPSG:4326")
      );
      
      changeRoute(transformed);
    };

    lineDraw.on("drawend", handleDrawEnd);

    return () => {
      lineDraw.un("drawend", handleDrawEnd);
    };
  }, [lineDraw, map]);

  // 초기 경로 검색 리스트 조회
  useEffect(() => {
    console.log("login:", Cookies.get("login"));

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/api/v1/routes` +
        `?categoryIdx=${categoryIdx}&name=${keyword}`, {
          credentials: "include",
        }
    )
      .then((res) => res.json())
      .then((json: RouteResponse) => {
        setData(json);
        console.log(data);
      })
      .catch((err) => {
        console.error("Error fetching routes:", err);
      });
    router.replace(pathName);
  }, [keyword]);

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
        {true ? (
          <>
            {isDrawBtnClicked ? (
              <h1>마우스 더블 클릭으로 경로를 완성하세요!!</h1>
            ) : (
              <button className={styles.button} onClick={startDraw}>
                내 경로 만들기
              </button>
            )}
          </>
        ) : (
          <></>
        )}

        <div className={styles.title}>찾고 싶은 경로를 입력하세요</div>
        <div className={styles.userSelect}>
          <SearchBox setName={(name: string) => setKeyword(name)} />
          <div className={styles.categoryDiv}>
            <div className={styles.categoryText}>카테고리</div>
            <Select saveData="" onChange={(e) => { setCategoryIdx(e.target.value) }} comboData={comboData} />
          </div>

          <hr className={styles.searchHr} />

          {data &&
            data.content.map((item, index) => {
              return (
                <Board
                  content={item}
                  key={index}
                  showRoute={showRoute}
                  moveMap={() => moveMap(item.information[0])}
                />
              );
            })}
        </div>
      </div>
      <CloseButton
        isClosed={isClosed}
        contentWidth={contentWidth}
        close={() => {
          setIsClosed(!isClosed);
        }}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h1>나의 경로 저장하기</h1>
        <br />
        <div className={styles.modalMiddleContainer}>
          <div className={styles.selectDiv}>
            카테고리
            <Select
              saveData={saveData}
              onChange={(e) => {
                setSaveData((prev) => ({
                  ...prev,
                  categoryIdx: e.target.value,
                }));
              }}
              comboData={comboData}
            />
          </div>
          <Input
            id="name"
            value={saveData.name}
            type="text"
            onChange={(e) => {
              setSaveData((prev) => ({
                ...prev,
                name: e.target.value,
              }));
            }}
          >
            경로명
          </Input>
          <div className={styles.textareaContainer}>
            설명
            <textarea
              className={styles.textarea}
              id="description"
              value={saveData.description}
              onChange={(e) => {
                setSaveData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }));
              }}
            />
          </div>
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
