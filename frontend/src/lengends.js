import React, { useEffect, useState } from 'react';
import L from 'leaflet';

const Legend = ({ map }) => {
  const [legendLayers, setLegendLayers] = useState([]);

  useEffect(() => {
    const fetchLegendLayers = () => {
      if (map) {
        const layers = [];
        map.eachLayer((layer) => {
          if (layer instanceof L.TileLayer.WMS) {
            const layerName = layer.options.layers;
            const layerTitle = layer.options.title || layerName;
            const legendUrl = `http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${layerName}`;
            layers.push({
              title: layerTitle,
              legendUrl,
            });
          }
        });
        console.log("Legend data:", layers);
        setLegendLayers(layers);
      }
    };

    fetchLegendLayers();

    // Set up a listener for layer add/remove events
    if (map) {
      map.on('layeradd layerremove', fetchLegendLayers);
    }

    return () => {
      // Clean up the listener when the component unmounts
      if (map) {
        map.off('layeradd layerremove', fetchLegendLayers);
      }
    };
  }, [map]);

  if (legendLayers.length === 0) {
    return null; // Don't render anything if there are no legend layers
  }

  return (
    <div id="legend" className="absolute bottom-4 right-4 bg-white border border-gray-400 p-4 rounded shadow-lg z-[1000]">
      <h4 className="font-bold mb-2">Features Added To Map</h4>
      {legendLayers.map((layer, index) => (
        <div key={index} className="flex items-center mb-2">
          {layer.legendUrl && (
            <img 
              src={layer.legendUrl} 
              alt={layer.title} 
              className="w-4 h-4 mr-2" 
              onError={(e) => e.target.style.display = 'none'} 
            />
          )}
          <span className="text-sm">{layer.title}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;