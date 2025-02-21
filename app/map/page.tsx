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

// interface RoutePath {
//   ServiceResult: {
//     comMsgHeader: string;
//     msgHeader: { headerCd: string; headerMsg: string; itemCount: number };
//     msgBody: {
//       itemList: ItemList[];
//     };
//   };
// }

const URL = process.env.BUS_ROUTE_API;

async function getRoutePath() {
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
  const routeCoordinates: number[][] = await getRoutePath();

  return (
    <div style={{ display: "flex", position: "relative" }}>
      <SideBar />
      <MainMap numArr={routeCoordinates} />
    </div>
  );
}
