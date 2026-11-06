
const { Pool } = require("pg");

// Vérification des variables d'environnement
const requiredVars = [
  "DB_HOST",
  "POSTGRES_DB",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD"
];

const missingVars = requiredVars.filter(
  (name) => !process.env[name]
);

if (missingVars.length > 0) {
  throw new Error(
    `Variables d'environnement manquantes : ${missingVars.join(", ")}`
  );
}

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
});

// Vérification de la connexion
pool.query("SELECT NOW()")
  .then(() => {
    console.log("✅ Connexion PostgreSQL réussie");
  })
  .catch((error) => {
    console.error(
      "❌ Erreur de connexion PostgreSQL :",
      error.message
    );
  });

module.exports = pool;
