
import { useState } from "react";
import {
  useMapEvents,
  Circle,
  CircleMarker,
  Tooltip,
} from "react-leaflet";

export default function BufferTool({
  active,
  radius,
  onCenterChange,
}) {
  const [center, setCenter] = useState(null);

  useMapEvents({
    click(event) {
      if (!active) return;

      const selectedPoint = event.latlng;

      // Enregistrer le centre du buffer
      setCenter(selectedPoint);

      // Transmettre les coordonnées à App.jsx
      onCenterChange?.({
        lat: selectedPoint.lat,
        lon: selectedPoint.lng,
      });
    },
  });

  if (!center) return null;

  return (
    <>
      <Circle
        center={center}
        radius={radius}
        pathOptions={{
          color: "#16a34a",
          fillColor: "#22c55e",
          fillOpacity: 0.15,
          weight: 2,
          dashArray: "6, 4",
        }}
      />

      <CircleMarker
        center={center}
        radius={6}
        pathOptions={{
          color: "#ffffff",
          fillColor: "#166b59",
          fillOpacity: 1,
          weight: 2,
        }}
      >
        <Tooltip permanent direction="top">
          Rayon : {radius} m
        </Tooltip>
      </CircleMarker>
    </>
  );
}
