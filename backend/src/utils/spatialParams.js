
function parseSpatialParams(query) {
  const { lat, lon, rayon } = query;

  if (
    typeof lat !== "string" ||
    typeof lon !== "string" ||
    typeof rayon !== "string" ||
    !lat.trim() ||
    !lon.trim() ||
    !rayon.trim()
  ) {
    return null;
  }

  const latitude = Number(lat);
  const longitude = Number(lon);
  const radius = Number(rayon);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    !Number.isFinite(radius) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180 ||
    radius < 100 ||
    radius > 5000
  ) {
    return null;
  }

  return {
    lat: latitude,
    lon: longitude,
    rayon: radius,
  };
}

module.exports = { parseSpatialParams };
