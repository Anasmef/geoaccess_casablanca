
import {
  Building2,
  Layers3,
  MapPinned,
  Activity,
} from "lucide-react";

export default function StatsCards({
  features = [],
  filteredCount = 0,
  loading = false,
  error = "",
}) {
  const total = features.length;

  const categories = new Set(
    features.map((feature) => feature.properties?.type || "Autre")
  ).size;

  const cards = [
    {
      label: "Total équipements",
      value: total,
      icon: Building2,
      color: "#176b59",
    },
    {
      label: "Catégories",
      value: categories,
      icon: Layers3,
      color: "#2563eb",
    },
    {
      label: "Résultats affichés",
      value: filteredCount,
      icon: MapPinned,
      color: "#9333ea",
    },
    {
      label: "Service WFS",
      value: loading ? "Chargement" : error ? "Erreur" : "Connecté",
      icon: Activity,
      color: error ? "#dc2626" : "#16a34a",
    },
  ];

  return (
    <section className="stats-grid">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <article className="stat-card" key={label}>
          <div className="stat-icon" style={{ color }}>
            <Icon size={22} />
          </div>

          <div>
            <p>{label}</p>
            <strong>{value}</strong>
          </div>
        </article>
      ))}
    </section>
  );
}
