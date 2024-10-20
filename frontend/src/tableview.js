import React, { useEffect, useState, useRef } from 'react';
// import { getCenter } from 'ol/extent';
// import VectorLayer from 'ol/layer/Vector';
// import VectorSource from 'ol/source/Vector';
// import { Style, Fill, Stroke } from 'ol/style';

const DetailsTableView = ({ tableData, tableColumnNames, map }) => {
  const [highlightLayer, setHighlightLayer] = useState(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    // const layer = new VectorLayer({
    //   source: new VectorSource(),
    //   style: new Style({
    //     fill: new Fill({ color: 'rgba(255, 0, 0, 0.3)' }),
    //     stroke: new Stroke({ color: '#FF0000', width: 3 }),
    //   }),
    //   zIndex: 999,
    // });

    // map.addLayer(layer);
    // setHighlightLayer(layer);

    // const handleMapClick = (event) => {
    //   const clickedFeature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
    //   if (clickedFeature) {
    //     highlightFeatureAndRow(clickedFeature);
    //   }
    // };

    // map.on('click', handleMapClick);

    // return () => {
    //   if (map) {
    //     map.removeLayer(layer);
    //     map.un('click', handleMapClick);
    //   }
    // };
  }, [map]);

  // const highlightFeatureAndRow = (feature) => {
  //   if (feature && feature.getGeometry()) {
  //     const extent = feature.getGeometry().getExtent();
  //     const center = getCenter(extent);
      
  //     map.getView().animate({
  //       center: center,
  //       zoom: 20,
  //       duration: 1000
  //     });

  //     if (highlightLayer) {
  //       const source = highlightLayer.getSource();
  //       source.clear();
        
  //       const highlightFeature = feature.clone();
  //       highlightFeature.setStyle(new Style({
  //         fill: new Fill({ color: 'rgba(255, 0, 0, 0.3)' }),
  //         stroke: new Stroke({ color: '#FF0000', width: 3 }),
  //       }));
        
  //       source.addFeature(highlightFeature);
  //       highlightLayer.changed();
  //     }

  //     // Find and scroll to the corresponding table row
  //     const featureId = feature.getId() || feature.get('id') || feature.ol_uid;
  //     setSelectedFeatureId(featureId);
  //     scrollToTableRow(featureId);
  //   }
  // };

  // const scrollToTableRow = (featureId) => {
  //   if (tableRef.current) {
  //     const rowElement = tableRef.current.querySelector(`[data-feature-id="${featureId}"]`);
  //     if (rowElement) {
  //       rowElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  //     }
  //   }
  // };

  // const handleRowClick = (feature) => {
  //   highlightFeatureAndRow(feature);
  // };

  return (
    <div className="h-1/4 bg-gray-800 w-full overflow-hidden relative">
      {/* Table Header */}
      {/* <div className="overflow-hidden">
        <table className="text-white w-full border-collapse">
          <thead className="bg-gray-900 sticky top-0 z-10">
            <tr>
              {tableColumnNames.map((column, index) => (
                <th key={index} className="border border-white p-2">{column.name}</th>
              ))}
            </tr>
          </thead>
        </table>
      </div>
      
      {/* Scrollable Table Body */}
      {/* <div className="overflow-y-auto h-full" ref={tableRef} style={{ maxHeight: 'calc(100% - 40px)' }}> {/* Adjust the height as necessary */}
        {/* <table className="text-white w-full border-collapse">
          <tbody>
            {tableData.map((feature, rowIndex) => {
              const featureId = feature.getId() || feature.get('id') || feature.ol_uid;
              return (
                <tr
                  key={rowIndex}
                  data-feature-id={featureId}
                  className={`
                    ${rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} 
                    hover:bg-gray-300
                    ${selectedFeatureId === featureId ? 'bg-yellow-200' : ''}
                  `}
                  onClick={() => handleRowClick(feature)}
                  style={{ cursor: 'pointer' }}
                > */}
                  {/* {tableColumnNames.map((column, colIndex) => (
                    <td key={colIndex} className="border text-black border p-2">
                      {feature.values_[column.name] !== undefined ? feature.values_[column.name] : 'N/A'}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div> */} 
    </div>
  );
};

export default DetailsTableView;
