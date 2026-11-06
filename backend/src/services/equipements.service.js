
const pool = require("../config/db");

// Récupérer tous les équipements
async function getAllEquipements() {
  const sql = `
    SELECT
      id,
      nom,
      type,
      adresse,
      ST_AsGeoJSON(geom)::json AS geometry
    FROM equipements
    ORDER BY id
  `;

  const result = await pool.query(sql);

  return {
    type: "FeatureCollection",
    features: result.rows.map((row) => ({
      type: "Feature",
      geometry: row.geometry,
      properties: {
        id: row.id,
        nom: row.nom,
        type: row.type,
        adresse: row.adresse,
      },
    })),
  };
}

// Rechercher les équipements dans un rayon
async function getEquipementsProches(lon, lat, rayon) {
  const sql = `
    SELECT
      id,
      nom,
      type,
      adresse,
      ST_AsGeoJSON(geom)::json AS geometry,
      ROUND(
        ST_Distance(
          geom::geography,
          ST_SetSRID(
            ST_MakePoint($1, $2), 4326
          )::geography
        )::numeric,
        2
      ) AS distance_m
    FROM equipements
    WHERE ST_DWithin(
      geom::geography,
      ST_SetSRID(
        ST_MakePoint($1, $2), 4326
      )::geography,
      $3
    )
    ORDER BY distance_m;
  `;

  const result = await pool.query(sql, [
    lon,
    lat,
    rayon,
  ]);

  return {
    type: "FeatureCollection",
    features: result.rows.map((row) => ({
      type: "Feature",
      id: row.id,
      geometry: row.geometry,
      properties: {
        nom: row.nom,
        type: row.type,
        adresse: row.adresse,
        distance_m: Number(row.distance_m),
      },
    })),
  };
}

// Statistiques spatiales
async function getStatistiques(lon, lat, rayon) {
  const sql = `
    WITH equipements_proches AS (
      SELECT
        type,
        ST_Distance(
          geom::geography,
          ST_SetSRID(
            ST_MakePoint($1, $2), 4326
          )::geography
        ) AS distance_m
      FROM equipements
      WHERE ST_DWithin(
        geom::geography,
        ST_SetSRID(
          ST_MakePoint($1, $2), 4326
        )::geography,
        $3
      )
    )
    SELECT
      COUNT(*)::integer AS total_equipements,
      COUNT(DISTINCT type)::integer AS total_categories,
      ROUND(AVG(distance_m)::numeric, 2)
        AS distance_moyenne_m,
      ROUND(MIN(distance_m)::numeric, 2)
        AS distance_minimale_m
    FROM equipements_proches;
  `;

  const repartitionSql = `
    SELECT
      type,
      COUNT(*)::integer AS nombre
    FROM equipements
    WHERE ST_DWithin(
      geom::geography,
      ST_SetSRID(
        ST_MakePoint($1, $2), 4326
      )::geography,
      $3
    )
    GROUP BY type
    ORDER BY type;
  `;

  const params = [lon, lat, rayon];

  const [statsResult, repartitionResult] =
    await Promise.all([
      pool.query(sql, params),
      pool.query(repartitionSql, params),
    ]);

  const stats = statsResult.rows[0];

  return {
    total_equipements: stats.total_equipements,
    total_categories: stats.total_categories,
    distance_moyenne_m:
      stats.distance_moyenne_m === null
        ? null
        : Number(stats.distance_moyenne_m),
    distance_minimale_m:
      stats.distance_minimale_m === null
        ? null
        : Number(stats.distance_minimale_m),
    repartition: repartitionResult.rows,
  };
}

module.exports = {
  getAllEquipements,
  getEquipementsProches,
  getStatistiques,
};
