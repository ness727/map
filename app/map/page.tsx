import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import SideBar from "../components/SideBar";

import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { LineString } from "ol/geom";
import Feature from "ol/Feature";
import MainMap from "../components/MainMap";
import { parseString } from "xml2js";
import { Coordinate } from "ol/coordinate";
import { Suspense } from "react";

interface ItemList {
  gpsX: string;
  gpsY: string;
  no: string;
  posX: string;
  posY: string;
}

/* 버스 노선 경로 위치 가져오기
  return [gpsX, gpsY] 2차원 배열
*/
async function getRoutePath() {
  const URL = process.env.BUS_ROUTE_API;
  const response = await fetch(URL || "");
  const xml = await response.text();
  const numArr: number[][] = [];

  parseString(xml, (err, result) => {
    const tempArr: ItemList[] = result.ServiceResult.msgBody[0].itemList;

    tempArr.map((route: ItemList) =>
      numArr.push([Number(route.gpsX), Number(route.gpsY)])
    );
  });
  return numArr;
}

/* 버스 위치 가져오기
  return [gpsX, gpsY] 2차원 배열
*/
async function getBusPosArr() {
  const URL = process.env.BUS_POS_API;
  const response = await fetch(URL || "");
  const xml = await response.text();
  const numArr: number[][] = [];

  parseString(xml, (err, result) => {
    const tempArr: ItemList[] = result.ServiceResult.msgBody[0].itemList;

    tempArr.map((route: ItemList) =>
      numArr.push([Number(route.gpsX), Number(route.gpsY)])
    );
  });
  return numArr;
}

export default async function MapPage() {
  const routePosArr: number[][] = await getRoutePath();
  const busPosArr: number[][] = await getBusPosArr();

  return (
    <div style={{ display: "flex", position: "relative" }}>
      <SideBar />
      <MainMap busRoutePosArr={routePosArr} busPosArr={busPosArr} />
    </div>
  );
}
