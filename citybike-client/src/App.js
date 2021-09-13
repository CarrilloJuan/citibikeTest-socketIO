import React from "react";
import Map from "./components/Map";
import { SocketProvider } from "./context/socketContext";

export default function App() {
  return (
    <div className="map">
      <h1> City Bikes in Miami </h1>
      <SocketProvider>
        <Map />
      </SocketProvider>
    </div>
  );
}
