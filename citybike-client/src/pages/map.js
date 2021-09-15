import React, { useState, useContext, useEffect } from "react";
import Map from "../components/map/map";
import Footer from "../components/footer/footer";
import { SocketContext } from "../context/socketContext";
import styles from "./style.module.css";

const getStats = (statatios = []) =>
  statatios.reduce(
    (acc, s) => ({
      ...acc,
      emptySlots: acc.emptySlots + s.empty_slots,
      freeBikes: acc.freeBikes + s.free_bikes,
    }),
    { emptySlots: 0, freeBikes: 0 }
  );

export default function MapPage() {
  const [currentAvailableBikes, setCurrentAvailableBikes] = useState([]);
  const [availableBikesByTime, setAvailableBikesByTime] = useState([]);
  const [location, setLocation] = useState({});
  const [stats, setStats] = useState({});

  const availableBikes =
    availableBikesByTime.length > 0
      ? availableBikesByTime
      : currentAvailableBikes;

  const [selectedValue, setSelectedValue] = useState("current");
  const { socket } = useContext(SocketContext);

  const handleOnSelectChange = (e) => {
    const selected = e.target.value;
    setSelectedValue(selected);
    if (selected === "current") {
      setAvailableBikesByTime([]);
      return;
    }
    socket.emit("re-play", selected);
  };

  useEffect(() => {
    socket.on("available-bikes", (availableBikesData) => {
      const { location = {}, stations = [] } = availableBikesData || {};
      setLocation(location);
      if (stations.length > 0) {
        setCurrentAvailableBikes(stations);
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

  useEffect(() => {
    const newStats = getStats(availableBikes);
    setStats(newStats);
  }, [availableBikes, currentAvailableBikes]);

  const { city, latitude = 48.856612, longitude = 2.352233 } = location;

  return (
    <div className={styles.container}>
      <Map availableBikes={availableBikes} center={[latitude, longitude]} />
      <Footer
        city={city}
        stats={stats}
        handleOnSelectChange={handleOnSelectChange}
        selectedValue={selectedValue}
      />
    </div>
  );
}
