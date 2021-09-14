import React from "react";
import { Marker as RLMarker, Popup } from "react-leaflet";

export default function Marker({
  position,
  name = "",
  empty_slots,
  free_bikes,
}) {
  return (
    <RLMarker position={position}>
      <Popup>
        {name}.<br />
        bikes: {free_bikes}
        <br />
        slots: {empty_slots}
        <br />
      </Popup>
    </RLMarker>
  );
}
