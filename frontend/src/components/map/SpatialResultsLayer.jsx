
import L from "leaflet";
import { GeoJSON } from "react-leaflet";

// Popup des résultats de l'analyse PostGIS
function popupResultat(feature, layer) {
  const p = feature.properties || {};
  const content = document.createElement("div");

  const title = document.createElement("strong");
  title.textContent = p.nom ?? "Équipement";
  content.appendChild(title);

  const type = document.createElement("p");
  type.textContent =
    `Type : ${p.type ?? "Non renseigné"}`;
  content.appendChild(type);

  const distance = document.createElement("p");
  distance.textContent =
    `Distance : ${Number(p.distance_m).toFixed(0)} m`;
  content.appendChild(distance);

  layer.bindPopup(content);
}

export default function SpatialResultsLayer({ data }) {
  if (!data) {
    return null;
  }

  return (
    <GeoJSON
      key={JSON.stringify(data)}
      data={data}
      pointToLayer={(feature, latlng) =>
        L.circleMarker(latlng, {
          radius: 15,
          color: "#ffffff",
          weight: 3,
          fillColor: "#f59e0b",
          fillOpacity: 0.95,
        })
      }
      onEachFeature={popupResultat}
    />
  );
}
