import React, { useEffect, useState } from 'react';

const Legend = ({ map }) => {
  const [legendLayers, setLegendLayers] = useState([]);

  useEffect(() => {
    // const fetchLegendLayers = () => {
    //   if (map) {
    //     const overlayGroup = map.getLayers().getArray().find(l => l.get('title') === 'Overlays');
    //     if (overlayGroup) {
    //       const layers = overlayGroup.getLayers().getArray();
    //       if (layers.length > 0) {
    //         const legendData = layers.map(layer => {
    //           const layerTitle = layer.get('title');
    //           const source = layer.getSource();
    //           let legendUrl = '';
              
    //           if (source && source.getParams) {
    //             const params = source.getParams();
    //             const layerName = params.LAYERS;
    //             legendUrl = `http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${layerName}`;
    //           }

    //           return {
    //             title: layerTitle,
    //             legendUrl,
    //           };
    //         });
    //         console.log("Legend data:", legendData);
    //         setLegendLayers(legendData);
    //       }
    //     }
    //   }
    // };

    // fetchLegendLayers();
    
    // // Set up a listener for layer changes
    // if (map) {
    //   const overlayGroup = map.getLayers().getArray().find(l => l.get('title') === 'Overlays');
    //   if (overlayGroup) {
    //     overlayGroup.on('change', fetchLegendLayers);
    //   }
    // }

    // return () => {
    //   // Clean up the listener when the component unmounts
    //   if (map) {
    //     const overlayGroup = map.getLayers().getArray().find(l => l.get('title') === 'Overlays');
    //     if (overlayGroup) {
    //       overlayGroup.un('change', fetchLegendLayers);
    //     }
    //   }
    // };
  }, [map]);

  if (legendLayers.length === 0) {
    return null; // Don't render anything if there are no legend layers
  }

  return (
    <div id="legend" className="absolute bottom-4 right-4 bg-white border border-gray-400 p-4 rounded shadow-lg z-10">
      {/* <h4 className="font-bold mb-2">Features Added To Map</h4>
      {legendLayers.map((layer, index) => (
        <div key={index} className="flex items-center mb-2">
          {layer.legendUrl && (
            <img src={layer.legendUrl} alt={layer.title} className="w-4 h-4 mr-2" onError={(e) => e.target.style.display = 'none'} />
          )}
          <span className="text-sm">{layer.title}</span>
        </div>
      ))} */}
    </div>
  );
};

export default Legend;