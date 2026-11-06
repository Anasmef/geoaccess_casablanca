
import { useState } from "react";

import useEquipements from "./hooks/useEquipements";
import { getEquipementsProches } from "./api/equipements.api";

import StatsCards from "./components/StatsCards";

import MapView from "./components/map/MapView";

import Sidebar from "./components/layout/Sidebar";

import useSpatialAnalysis from "./hooks/useSpatialAnalysis";

import "leaflet/dist/leaflet.css";
import "./App.css";


function App() {
  const {
    features,
    filtered,
    filteredGeoJSON,
    types,
    search,
    setSearch,
    type,
    setType,
    loading,
    error,
    charger,
  } = useEquipements();

  const {
  bufferRadius,
  bufferCenter,
  spatialResults,
  spatialLoading,
  spatialError,
  changeBufferCenter,
  changeBufferRadius,
  rechercherProximite,
  resetResults,
} = useSpatialAnalysis();

  const [selectedFeature, setSelectedFeature] = useState(null);
  const [measureMode, setMeasureMode] = useState(false);
  const [bufferMode, setBufferMode] = useState(false);



  return (
    <div className="flex min-h-screen flex-col bg-dashboard lg:h-screen lg:flex-row lg:overflow-hidden">
   
      <Sidebar
        filtered={filtered}
        types={types}
        search={search}
        setSearch={setSearch}
        type={type}
        setType={setType}
        loading={loading}
        error={error}
        charger={charger}
        onSelectFeature={setSelectedFeature}
        measureMode={measureMode}
        onToggleMeasure={() => {
          setMeasureMode((previous) => !previous);
          setBufferMode(false);
        }}
        bufferMode={bufferMode}
        onToggleBuffer={() => {
          setBufferMode((previous) => !previous);
          setMeasureMode(false);
        }}
        bufferRadius={bufferRadius}
        onRadiusChange={changeBufferRadius}
        bufferCenter={bufferCenter}
        spatialResults={spatialResults}
        spatialLoading={spatialLoading}
        spatialError={spatialError}
        onSearchProximity={rechercherProximite}
      />
      <main className="flex min-h-[65vh] min-w-0 flex-1 flex-col lg:min-h-0">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-[25px] py-5">
        <div>
          <h2 className="text-[19px] font-bold text-geo-text">
            Carte des équipements publics
          </h2>

          <p className="mt-[5px] text-[13px] text-slate-500">
            Casablanca, Maroc
          </p>
        </div>

        <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
          WMS · WFS
        </span>
      </header>

        <StatsCards
          features={features}
          filteredCount={filtered.length}
          loading={loading}
          error={error}
        />
        <MapView
          filteredGeoJSON={filteredGeoJSON}
          spatialResults={spatialResults}
          selectedFeature={selectedFeature}
          measureMode={measureMode}
          bufferMode={bufferMode}
          bufferRadius={bufferRadius}
          onBufferCenterChange={changeBufferCenter}
        />
      </main>
    </div>
  );
}

export default App;
