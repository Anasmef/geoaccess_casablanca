
INSERT INTO equipements (nom, type, adresse, geom)
VALUES
(
  'Hopital Demo A',
  'hopital',
  'Casablanca - fictif',
  ST_SetSRID(ST_MakePoint(-7.62, 33.59), 4326)
),
(
  'Ecole Demo B',
  'ecole',
  'Casablanca - fictif',
  ST_SetSRID(ST_MakePoint(-7.60, 33.58), 4326)
),
(
  'Administration Demo C',
  'administration',
  'Casablanca - fictif',
  ST_SetSRID(ST_MakePoint(-7.65, 33.57), 4326)
);
