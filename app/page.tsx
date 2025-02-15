"use client";

import "ol/ol.css";
import TileLayer from "ol/layer/Tile";
import { Map, View } from "ol";
import OSM from "ol/source/OSM";
import { useEffect } from "react";
import SideBar from "./components/SideBar";

export default function Home() {
  useEffect(() => {
    new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
    });
  }, []);

  return (
    <div style={{ display: "flex", position: "relative" }}>
      <SideBar />
      <div id="map" style={{ width: "100vw", height: "100vh" }}></div>
    </div>
  );
}
