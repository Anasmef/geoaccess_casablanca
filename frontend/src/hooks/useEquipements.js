
import { useEffect, useMemo, useState } from "react";
import { getEquipements } from "../api/equipements.api";

export default function useEquipements() {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("Tous");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function charger() {
    setLoading(true);
    setError("");

    try {
      const geojson = await getEquipements();
      setData(geojson);
    } catch (err) {
      console.error("Erreur WFS :", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    charger();
  }, []);

  const features = data?.features || [];

  const types = useMemo(() => {
    return [
      "Tous",
      ...new Set(
        (data?.features || []).map(
          (f) => f.properties?.type || "Autre"
        )
      ),
    ];
  }, [data]);

  const filtered = features.filter((feature) => {
    const p = feature.properties || {};
    const nom = String(p.nom || "").toLowerCase();

    return (
      nom.includes(search.toLowerCase()) &&
      (type === "Tous" || p.type === type)
    );
  });

  const filteredGeoJSON = {
    type: "FeatureCollection",
    features: filtered,
  };

  return {
    features,
    filtered,
    filteredGeoJSON,
    types,
    search,
    setSearch,
    type,
    setType,
    loading,
    error,
    charger,
  };
}
