
import { useState } from "react";
import {
  useMapEvents,
  CircleMarker,
  Polyline,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";

export default function DistanceTool({ active }) {
  const [points, setPoints] = useState([]);

  useMapEvents({
    click(event) {
      if (!active) return;

      const position = event.latlng;

      setPoints((previous) => {
        if (previous.length >= 2) {
          return [position];
        }

        return [...previous, position];
      });
    },
  });

  const distance =
    points.length === 2
      ? L.latLng(points[0]).distanceTo(points[1])
      : null;

  return (
    <>
      {points.map((point, index) => (
        <CircleMarker
          key={index}
          center={point}
          radius={7}
          pathOptions={{
            color: "#176b59",
            fillColor: "#176b59",
            fillOpacity: 1,
          }}
        >
          <Tooltip permanent direction="top">
            Point {index + 1}
          </Tooltip>
        </CircleMarker>
      ))}

      {points.length === 2 && (
        <Polyline
          positions={points}
          pathOptions={{
            color: "#176b59",
            weight: 3,
            dashArray: "8, 6",
          }}
        >
          <Tooltip permanent>
            {distance >= 1000
              ? `${(distance / 1000).toFixed(2)} km`
              : `${distance.toFixed(0)} m`}
          </Tooltip>
        </Polyline>
      )}
    </>
  );
}
