
import L from "leaflet";
import { GeoJSON } from "react-leaflet";

// Couleur selon la catégorie de l'équipement
function couleur(type = "") {
  const value = String(type).toLowerCase();

  if (
    value.includes("hopital") ||
    value.includes("hôpital")
  ) {
    return "#ef4444";
  }

  if (
    value.includes("ecole") ||
    value.includes("école")
  ) {
    return "#2563eb";
  }

  if (value.includes("administration")) {
    return "#16a34a";
  }

  return "#9333ea";
}

// Afficher les informations d'un équipement
function popupEquipement(feature, layer) {
  const p = feature.properties || {};
  const content = document.createElement("div");

  const title = document.createElement("strong");
  title.textContent = p.nom || "Équipement";
  content.appendChild(title);

  for (const [label, value] of [
    ["Type", p.type],
    ["Adresse", p.adresse],
  ]) {
    const line = document.createElement("p");
    line.textContent =
      `${label} : ${value || "Non renseigné"}`;

    content.appendChild(line);
  }

  layer.bindPopup(content);
}

export default function EquipmentLayer({ data }) {
  return (
    <GeoJSON
      key={JSON.stringify(data)}
      data={data}
      pointToLayer={(feature, latlng) =>
        L.circleMarker(latlng, {
          radius: 9,
          color: "#ffffff",
          weight: 2,
          fillColor: couleur(feature.properties?.type),
          fillOpacity: 0.95,
        })
      }
      onEachFeature={popupEquipement}
    />
  );
}
