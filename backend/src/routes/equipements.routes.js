
const express = require("express");

const equipementsController =
  require("../controllers/equipements.controller");

const router = express.Router();

// Liste de tous les équipements
router.get("/", equipementsController.getAll);

// Recherche spatiale par rayon
router.get(
  "/proximite",
  equipementsController.getProximite
);

// Statistiques spatiales
router.get(
  "/statistiques",
  equipementsController.getStatistiques
);

module.exports = router;
