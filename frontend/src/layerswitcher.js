import React, { useEffect, useState } from 'react';
import L from 'leaflet';

const LayerSwitcher = ({ map }) => {
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    if (!map) return;

    const updateLayers = () => {
      const layersList = [];
      map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer.WMS || layer instanceof L.GeoJSON) {
          layersList.push({
            id: L.Util.stamp(layer),
            name: layer.options.title || 'Unnamed Layer',
            layer: layer,
            active: map.hasLayer(layer)
          });
        }
      });
      setLayers(layersList);
    };

    updateLayers();
    map.on('layeradd layerremove', updateLayers);

    return () => {
      map.off('layeradd layerremove', updateLayers);
    };
  }, [map]);

  const handleLayerToggle = (layerId) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      if (map.hasLayer(layer.layer)) {
        map.removeLayer(layer.layer);
      } else {
        map.addLayer(layer.layer);
      }
    }
  };

  return (
    <div className="leaflet-middle-right ">
      <div className="leaflet-control leaflet-bar bg-white p-2 rounded shadow-lg max-h-[50vh] overflow-y-auto">
        <h4 className="font-bold mb-2">Layers Switcher</h4>
        {layers.map((layer) => (
          <div key={layer.id} className="flex items-center mb-1">
            <input
              type="checkbox"
              id={`layer-${layer.id}`}
              checked={layer.active}
              onChange={() => handleLayerToggle(layer.id)}
              className="mr-2"
            />
            <label htmlFor={`layer-${layer.id}`} className="text-sm cursor-pointer">
              {layer.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerSwitcher;