import React, { useState, useContext, useEffect } from "react";
import Map from "../components/map";
import { SocketContext } from "../context/socketContext";

export default function MapPage() {
  const [currentAvailableBikes, setCurrentAvailableBikes] = useState([]);
  const [availableBikesByTime, setAvailableBikesByTime] = useState([]);

  const availableBikes =
    availableBikesByTime.length > 0
      ? availableBikesByTime
      : currentAvailableBikes;

  const [selectedValue, setSelectedValue] = useState("Orange");
  const { socket } = useContext(SocketContext);

  const handleChange = (e) => {
    const selected = e.target.value;
    setSelectedValue(selected);
    if (selected === "current") {
      setAvailableBikesByTime([]);
    }
    socket.emit("re-play", selected);
  };

  useEffect(() => {
    socket.on("available-bikes", (bikes) => {
      const bikeStations = bikes?.stations;
      if (bikeStations) {
        setCurrentAvailableBikes(bikeStations);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on("available-bikes-by-time", (bikes) => {
      const bikeStations = bikes?.stations;
      if (bikeStations) {
        setAvailableBikesByTime(bikeStations);
      }
    });
  }, [socket]);

  return (
    <div className="map">
      <h1> City Bikes in Miami </h1>
      <div>
        <select value={selectedValue} onChange={handleChange}>
          <option value="current">current</option>
          <option value="1">Last four hours</option>
          <option value="2">Last eight hours</option>
          <option value="3">Last twelve hours</option>
        </select>
      </div>
      <Map availableBikes={availableBikes} />
    </div>
  );
}
