import React, { useContext, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import Marker from "./Marker";
import { SocketContext } from "../context/socketContext";

const position = [25.761681, -80.191788];
const zoom = 13;

export default function Map() {
  const [availableBikes] = useState([]);
  const { socket } = useContext(SocketContext);
  return (
    <MapContainer center={position} zoom={zoom} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[25.72805, -80.24173]} />
    </MapContainer>
  );
}
