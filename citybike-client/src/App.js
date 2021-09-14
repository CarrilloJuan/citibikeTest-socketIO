import React from "react";
import Map from "./pages/map";
import { SocketProvider } from "./context/socketContext";

export default function App() {
  return (
    <SocketProvider>
      <Map />
    </SocketProvider>
  );
}
