
import {
  MapContainer,
  TileLayer,
  LayersControl,
  WMSTileLayer,
} from "react-leaflet";

import DistanceTool from "../DistanceTool";
import BufferTool from "../BufferTool";
import MapController from "../MapController";

import EquipmentLayer from "./EquipmentLayer";
import SpatialResultsLayer from "./SpatialResultsLayer";

export default function MapView({
  filteredGeoJSON,
  spatialResults,
  selectedFeature,
  measureMode,
  bufferMode,
  bufferRadius,
  onBufferCenterChange,
}) {
  return (
    <MapContainer
      center={[33.585, -7.62]}
      zoom={12}
      className="map"
    >
      {/* Outil de mesure */}
      <DistanceTool active={measureMode} />

      {/* Outil buffer */}
      <BufferTool
        active={bufferMode}
        radius={bufferRadius}
        onCenterChange={onBufferCenterChange}
      />

      {/* Zoom sur un équipement */}
      <MapController selectedFeature={selectedFeature} />

      <LayersControl position="topright">

        {/* Fond OpenStreetMap */}
        <LayersControl.BaseLayer
          checked
          name="OpenStreetMap"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>

        {/* Couche WMS GeoServer */}
        <LayersControl.Overlay name="GeoServer WMS">
          <WMSTileLayer
            url="/geoserver/geoaccess/wms"
            layers="geoaccess:equipements"
            format="image/png"
            transparent={true}
            version="1.1.1"
          />
        </LayersControl.Overlay>

        {/* Couche WFS des équipements */}
        <LayersControl.Overlay
          checked
          name="Équipements WFS"
        >
          <EquipmentLayer data={filteredGeoJSON} />
        </LayersControl.Overlay>

      </LayersControl>

      {/* Résultats de proximité PostGIS */}
      <SpatialResultsLayer data={spatialResults} />

    </MapContainer>
  );
}
