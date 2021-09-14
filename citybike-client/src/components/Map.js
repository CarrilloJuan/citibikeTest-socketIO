import React, { useContext, useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import Marker from "./Marker";
import { SocketContext } from "../context/socketContext";

const position = [25.761681, -80.191788];
const zoom = 13;

export default function Map() {
  const [availableBikes, setAvailableBikes] = useState([]);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket.on("available-bikes", (bikes) => {
      const bikeStations = bikes.stations;
      if (bikeStations) {
        setAvailableBikes(bikeStations);
      }
    });
  }, [socket]);

  return (
    <MapContainer center={position} zoom={zoom} scrollWheelZoom={false}>
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
