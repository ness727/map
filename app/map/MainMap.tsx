"use client";

import { View, Map, Feature } from "ol";
import { GeoJSON } from "ol/format";
import { Draw } from "ol/interaction";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import { OSM } from "ol/source";
import { useEffect, useState } from "react";
import { LineString, Point } from "ol/geom";
import VectorSource from "ol/source/Vector";
import { Coordinate } from "ol/coordinate";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Icon from "ol/style/Icon";

import styles from './MainMap.module.css'
import VectorLayer from "ol/layer/Vector";

export default function MainMap() {
  return (
    <>
      <div id="map" style={{ width: "100vw", height: "100vh"}}></div>
    </>
  );
}
