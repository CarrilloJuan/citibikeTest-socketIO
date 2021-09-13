import React from "react";
import { Marker as RLMarker, Popup } from "react-leaflet";

export default function Marker({ position }) {
  return (
    <RLMarker position={position}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </RLMarker>
  );
}
