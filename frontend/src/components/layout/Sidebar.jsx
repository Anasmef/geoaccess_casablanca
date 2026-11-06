
import { Search, MapPin, CheckCircle2 } from "lucide-react";

function couleur(type = "") {
  const value = String(type).toLowerCase();

  if (value.includes("hopital") || value.includes("hôpital"))
    return "#ef4444";

  if (value.includes("ecole") || value.includes("école"))
    return "#2563eb";

  if (value.includes("administration"))
    return "#16a34a";

  return "#9333ea";
}

export default function Sidebar({
  filtered,
  types,
  search,
  setSearch,
  type,
  setType,
  loading,
  error,
  charger,
  onSelectFeature,
  measureMode,
  onToggleMeasure,
  bufferMode,
  onToggleBuffer,
  bufferRadius,
  onRadiusChange,
  bufferCenter,
  spatialResults,
  spatialLoading,
  spatialError,
  onSearchProximity,
}) {
  return (
    <aside className="sidebar">
      <h1>GeoAccess</h1>
      <p className="subtitle">Casablanca · WebGIS</p>

      <div className="stats">
        <span>Équipements affichés</span>
        <strong>{filtered.length}</strong>
      </div>

      <label htmlFor="equipment-search">
        Rechercher un équipement
      </label>
      <input
        id="equipment-search"
        placeholder="Nom de l'équipement..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <label htmlFor="equipment-type">Filtrer par type</label>
      <select
        id="equipment-type"
        value={type}
        onChange={(event) => setType(event.target.value)}
      >
        {types.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <button type="button" onClick={charger}>
        Actualiser les données
      </button>

      {/* Outil de mesure */}
      <button
        type="button"
        className="measure-button"
        onClick={onToggleMeasure}
      >
        {measureMode
          ? "Désactiver la mesure"
          : "Mesurer une distance"}
      </button>

      {measureMode && (
        <p className="measure-help">
          Clique sur deux endroits de la carte pour mesurer leur
          distance directe. Un troisième clic commence une
          nouvelle mesure.
        </p>
      )}

      {/* Outil buffer */}
      <button
        type="button"
        className="buffer-button"
        onClick={onToggleBuffer}
      >
        {bufferMode
          ? "Désactiver le buffer"
          : "Créer un buffer"}
      </button>

      {bufferMode && (
        <div className="buffer-controls">
          <label htmlFor="buffer-radius">
            Rayon du buffer : {bufferRadius} m
          </label>

          <input
            id="buffer-radius"
            type="range"
            min="100"
            max="5000"
            step="100"
            value={bufferRadius}
            onChange={(event) =>
              onRadiusChange(Number(event.target.value))
            }
          />

          <p
            className={`buffer-status ${
              bufferCenter ? "buffer-status-selected" : ""
            }`}
          >
            {bufferCenter ? (
              <>
                <CheckCircle2 size={16} />
                Centre sélectionné. Lancez l'analyse spatiale.
              </>
            ) : (
              <>
                <MapPin size={16} />
                Cliquez sur la carte pour définir le centre.
              </>
            )}
          </p>
        </div>
      )}

      {/* Analyse spatiale */}
      {bufferMode && (
        <div className="spatial-analysis">
          <div className="spatial-header">
            <div className="spatial-header-icon">
              <Search size={21} />
            </div>

            <div>
              <h3>Analyse de proximité</h3>
              <p>Recherche spatiale PostGIS</p>
            </div>
          </div>

          <div className="spatial-info">
            <span>Rayon de recherche</span>
            <strong>
              {bufferRadius.toLocaleString("fr-FR")} m
            </strong>
          </div>

          <button
            type="button"
            className="spatial-search-btn"
            onClick={onSearchProximity}
            disabled={!bufferCenter || spatialLoading}
          >
            <Search size={18} />
            {spatialLoading
              ? "Recherche en cours..."
              : "Rechercher les équipements"}
          </button>

          {!bufferCenter && (
            <p className="spatial-hint">
              Cliquez sur la carte pour choisir un centre.
            </p>
          )}

          {spatialError && (
            <p className="spatial-error" role="alert">
              {spatialError}
            </p>
          )}

          {spatialResults && (
            <div className="spatial-results">
              <div className="spatial-results-header">
                <h3>Résultats de l'analyse</h3>
                <span className="spatial-count">
                  {spatialResults.features.length} trouvé(s)
                </span>
              </div>

              {spatialResults.features.length === 0 ? (
                <p className="spatial-empty">
                  Aucun équipement trouvé dans ce rayon.
                </p>
              ) : (
                spatialResults.features.map((feature, index) => (
                  <div
                    className="spatial-result-card"
                    key={feature.id ?? index}
                  >
                    <div className="spatial-result-details">
                      <strong>
                        {feature.properties?.nom || "Équipement"}
                      </strong>
                      <span>
                        {feature.properties?.type || "Autre"}
                      </span>
                    </div>

                    <div className="spatial-distance">
                      <strong>
                        {Number(
                          feature.properties?.distance_m
                        ).toFixed(0)} m
                      </strong>
                      <span>Distance</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Liste des équipements */}
      {loading && <p>Chargement...</p>}
      {error && <p className="error">{error}</p>}

      <h2>Équipements</h2>
      <div className="equipment-list">
        {filtered.map((feature, index) => (
          <button
            type="button"
            className="equipment equipment-button"
            key={feature.id ?? index}
            onClick={() => onSelectFeature({ ...feature })}
          >
            <div>
              <strong>
                {feature.properties?.nom || "Sans nom"}
              </strong>
              <small>
                {feature.properties?.type || "Autre"}
              </small>
            </div>
          </button>
        ))}
      </div>

      {/* Légende */}
      <h2>Légende</h2>
      <div className="legend">
        {types
          .filter((item) => item !== "Tous")
          .map((item) => (
            <div key={item}>
              <span
                className="dot"
                style={{ background: couleur(item) }}
              />
              {item}
            </div>
          ))}
      </div>

      <p className="footer">
        Données fictives de démonstration · GeoServer / PostGIS
      </p>
    </aside>
  );
}
