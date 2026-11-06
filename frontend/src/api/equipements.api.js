
const WFS_URL =
  "/geoserver/geoaccess/ows?" +
  new URLSearchParams({
    service: "WFS",
    version: "2.0.0",
    request: "GetFeature",
    typeNames: "geoaccess:equipements",
    outputFormat: "application/json",
    srsName: "EPSG:4326",
  });

async function fetchGeoJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status}`);
  }

  const data = await response.json();

  if (
    data.type !== "FeatureCollection" ||
    !Array.isArray(data.features)
  ) {
    throw new Error("Réponse GeoJSON invalide");
  }

  return data;
}

// Récupérer les équipements via GeoServer WFS
export function getEquipements() {
  return fetchGeoJSON(WFS_URL);
}

// Rechercher les équipements dans un rayon
export function getEquipementsProches(lat, lon, rayon) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    rayon: String(rayon),
  });

  return fetchGeoJSON(
    `/api/equipements/proximite?${params.toString()}`
  );
}

// Récupérer les statistiques PostGIS
export async function getStatistiques(lat, lon, rayon) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    rayon: String(rayon),
  });

  const response = await fetch(
    `/api/equipements/statistiques?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status}`);
  }

  return response.json();
}
