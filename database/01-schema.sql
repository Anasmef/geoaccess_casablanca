
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS equipements (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL,
    adresse TEXT,
    geom GEOMETRY(Point, 4326) NOT NULL
);

CREATE INDEX idx_equipements_geom
ON equipements USING GIST (geom);
