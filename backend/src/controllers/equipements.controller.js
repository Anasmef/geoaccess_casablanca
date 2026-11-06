
const equipementsService =
  require("../services/equipements.service");

const { parseSpatialParams } =
  require("../utils/spatialParams");

// GET /api/equipements
async function getAll(req, res) {
  try {
    const data =
      await equipementsService.getAllEquipements();

    return res.json(data);
  } catch (error) {
    console.error("Erreur récupération :", error);

    return res.status(500).json({
      error: "Erreur de récupération des équipements",
    });
  }
}

// GET /api/equipements/proximite
async function getProximite(req, res) {
  const params = parseSpatialParams(req.query);

  if (!params) {
    return res.status(400).json({
      error: "Coordonnées ou rayon invalides (100 à 5000 m).",
    });
  }

  try {
    const data =
      await equipementsService.getEquipementsProches(
        params.lon,
        params.lat,
        params.rayon
      );

    return res.json(data);
  } catch (error) {
    console.error("Erreur proximité :", error);

    return res.status(500).json({
      error: "Erreur interne lors de l'analyse spatiale.",
    });
  }
}

// GET /api/equipements/statistiques
async function getStatistiques(req, res) {
  const params = parseSpatialParams(req.query);

  if (!params) {
    return res.status(400).json({
      error: "Coordonnées ou rayon invalides.",
    });
  }

  try {
    const data =
      await equipementsService.getStatistiques(
        params.lon,
        params.lat,
        params.rayon
      );

    return res.json(data);
  } catch (error) {
    console.error("Erreur statistiques :", error);

    return res.status(500).json({
      error: "Erreur de calcul des statistiques spatiales.",
    });
  }
}

module.exports = {
  getAll,
  getProximite,
  getStatistiques,
};
