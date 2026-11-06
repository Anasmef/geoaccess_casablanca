
import { useRef, useState } from "react";
import { getEquipementsProches } from "../api/equipements.api";

export default function useSpatialAnalysis() {
  const [bufferRadius, setBufferRadius] = useState(1000);
  const [bufferCenter, setBufferCenter] = useState(null);

  const [spatialResults, setSpatialResults] = useState(null);
  const [spatialLoading, setSpatialLoading] = useState(false);
  const [spatialError, setSpatialError] = useState("");

  // Identifie la dernière requête spatiale.
  // Permet d'ignorer une réponse devenue obsolète.
  const requestId = useRef(0);

  function resetResults() {
    requestId.current += 1;
    setSpatialResults(null);
    setSpatialError("");
    setSpatialLoading(false);
  }

  // Changer le centre du buffer
  function changeBufferCenter(point) {
    setBufferCenter(point);
    resetResults();
  }

  // Changer le rayon du buffer
  function changeBufferRadius(radius) {
    setBufferRadius(radius);
    resetResults();
  }

  // Rechercher les équipements dans le buffer
  async function rechercherProximite() {
    if (!bufferCenter) {
      setSpatialError("Sélectionne un point sur la carte.");
      return;
    }

    const currentRequest = ++requestId.current;

    setSpatialLoading(true);
    setSpatialError("");
    setSpatialResults(null);

    try {
      const geojson = await getEquipementsProches(
        bufferCenter.lat,
        bufferCenter.lon,
        bufferRadius
      );

      // Ne pas afficher une réponse d'une ancienne recherche.
      if (currentRequest !== requestId.current) return;

      setSpatialResults(geojson);
    } catch (err) {
      if (currentRequest !== requestId.current) return;

      console.error("Erreur analyse spatiale :", err);
      setSpatialError(err.message);
    } finally {
      if (currentRequest === requestId.current) {
        setSpatialLoading(false);
      }
    }
  }

  return {
    bufferRadius,
    bufferCenter,
    spatialResults,
    spatialLoading,
    spatialError,
    changeBufferCenter,
    changeBufferRadius,
    rechercherProximite,
    resetResults,
  };
}
