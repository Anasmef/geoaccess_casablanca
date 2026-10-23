
const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        nom,
        type,
        adresse,
        ST_AsGeoJSON(geom)::json AS geometry
      FROM equipements
      ORDER BY id
    `);

    const features = result.rows.map((item) => ({
      type: "Feature",
      geometry: item.geometry,
      properties: {
        id: item.id,
        nom: item.nom,
        type: item.type,
        adresse: item.adresse
      }
    }));

    res.json({
      type: "FeatureCollection",
      features
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      error: "Erreur de récupération des équipements"
    });
  }
});

module.exports = router;
