const express = require("express");

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "GeoAccess API is running",
    project: "GeoAccess Casablanca"
  });
});

const PORT = process.env.PORT || 5000;




const pool = require("./config/db");

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        current_database() AS database,
        PostGIS_Version() AS postgis_version
    `);

    res.json({
      status: "success",
      connection: "PostgreSQL/PostGIS connected",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      status: "error",
      message: "Database connection failed"
    });
  }
});

const equipementsRoutes = require(
  "./routes/equipements.routes"
);

app.use("/api/equipements", equipementsRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});