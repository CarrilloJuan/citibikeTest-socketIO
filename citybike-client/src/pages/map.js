import React, { useState, useContext, useEffect, useReducer } from "react";
import Map from "../components/map/map";
import Footer from "../components/footer/footer";
import { SocketContext } from "../context/socketContext";
import styles from "./style.module.css";

const initialState = {
  currentAvailableBikes: [],
  availableBikesByTime: [],
  displayAvailableBickesByTime: false,
  location: {},
  statsByTime: [],
  currentStats: [],
};

const reducer = (state, action) => {
  const { type, payload } = action;
  const { stations = [], stats = [], location } = payload;
  console.log(action.type);

  switch (type) {
    case "SET_CURRENT_AVAILABLE_BIKES":
      return {
        ...state,
        location,
        currentStats: stats,
        currentAvailableBikes: stations,
      };
    case "SET_AVAILABLE_BIKES_BY_RANGE_TIME":
      if (stations.length > 0) {
        return {
          ...state,
          statsByTime: stats,
          availableBikesByTime: stations,
        };
      }
      return {
        ...state,
        displayAvailableBickesByTime: false,
      };
    case "DISPLAY_AVAILABLE_BY_TIME":
      return {
        ...state,
        displayAvailableBickesByTime: action.payload,
      };
    default:
      return state;
  }
};

export default function MapPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedValue, setSelectedValue] = useState("current");
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket.on("current-available-bikes", (availableBikesData) => {
      dispatch({
        type: "SET_CURRENT_AVAILABLE_BIKES",
        payload: availableBikesData,
      });
    });
  }, [socket]);

  const handleOnSelectChange = (e) => {
    const selected = e.target.value;
    setSelectedValue(selected);
    socket.emit("re-play", selected);
    if (selected === "current") {
      return dispatch({ type: "DISPLAY_AVAILABLE_BY_TIME", payload: false });
    }
    dispatch({ type: "DISPLAY_AVAILABLE_BY_TIME", payload: true });
  };

  useEffect(() => {
    socket.on("available-bikes-by-time", (availableBikesData) => {
      dispatch({
        type: "SET_AVAILABLE_BIKES_BY_RANGE_TIME",
        payload: availableBikesData,
      });
    });
  }, [socket]);

  const {
    currentAvailableBikes,
    availableBikesByTime,
    displayAvailableBickesByTime,
    location,
    statsByTime,
    currentStats,
  } = state;

  const { city, latitude = 25.790654, longitude = -80.1300455 } = location;

  const availableBikes = displayAvailableBickesByTime
    ? availableBikesByTime
    : currentAvailableBikes;

  const stats = displayAvailableBickesByTime ? statsByTime : currentStats;

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
