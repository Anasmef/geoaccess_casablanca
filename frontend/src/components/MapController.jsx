
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapController({ selectedFeature }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedFeature) return;

    if (selectedFeature.geometry?.type !== "Point") return;

    const [longitude, latitude] =
      selectedFeature.geometry.coordinates;

    map.flyTo([latitude, longitude], 15, {
      duration: 1.2,
    });

    map.eachLayer((layer) => {
      if (
        layer.feature?.id === selectedFeature.id &&
        typeof layer.openPopup === "function"
      ) {
        layer.openPopup();
      }
    });
  }, [selectedFeature, map]);

  return null;
}
