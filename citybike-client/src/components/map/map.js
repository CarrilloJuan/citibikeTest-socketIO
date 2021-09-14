import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import Marker from "../marker/marker";
import styles from "./style.module.css";

export default function Map({ availableBikes, zoom = 12, center }) {
  return (
    <MapContainer
      className={styles.container}
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {availableBikes.map((bike) => (
        <Marker
          key={bike.id}
          position={[bike.latitude, bike.longitude]}
          {...bike}
        />
      ))}
    </MapContainer>
  );
}
