import React, { useState } from 'react';
// import { Vector as VectorLayer } from 'ol/layer';
// import { Vector as VectorSource } from 'ol/source';
// import { GeoJSON } from 'ol/format';
// import { Style, Fill, Stroke } from 'ol/style';
// import {isEmpty } from 'ol/extent';


function SimpleQuery({addLayerToMap,RerenderLayerSwitcherPanel, setSimpleQueryResults,setIsTableViewOpen,map,setTableColumnNames,seTableData }) {
    const [value, setValue] = useState('');
    const [layerColor, setLayerColor] = useState('rgba(255, 0, 0, 1)'); 
   

    const handleValueChange = (event) => {
        setValue(event.target.value);
    };

    const baseUrl = 'http://localhost:8080/geoserver/nurc/ows';

    const constructSearchQuery = async (searchValue) => {
        const capabilitiesUrl = new URL(baseUrl);
        capabilitiesUrl.search = new URLSearchParams({
            service: 'WFS',
            version: '2.0.0',
            request: 'GetCapabilities'
        }).toString();

        const capabilitiesResponse = await fetch(capabilitiesUrl);
        const capabilitiesXml = await capabilitiesResponse.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(capabilitiesXml, "text/xml");
        const featureTypes = Array.from(xmlDoc.getElementsByTagName('FeatureType'));

        const searchPromises = featureTypes.map(async (featureType) => {
            const typeName = featureType.getElementsByTagName('Name')[0].textContent;
         
            const describeFeatureTypeUrl = new URL(baseUrl);
            describeFeatureTypeUrl.search = new URLSearchParams({
                service: 'WFS',
                version: '2.0.0',
                request: 'DescribeFeatureType',
                typeName: typeName
            }).toString();

            const describeResponse = await fetch(describeFeatureTypeUrl);
            const describeXml = await describeResponse.text();
            const describeDoc = parser.parseFromString(describeXml, "text/xml");
            const attributes = Array.from(describeDoc.getElementsByTagName('xsd:element'))
                .map(elem => ({
                    name: elem.getAttribute('name'),
                    type: elem.getAttribute('type')
                }))
                .filter(attr => attr.name !== 'geom' && attr.name !== 'geometry');
             setTableColumnNames(attributes)
            const cqlFilter = attributes
                .map(attr => {
                    if (attr.type.includes('string')) {
                        return `${attr.name} ILIKE '%${searchValue}%'`;
                    } else if (attr.type.includes('int') || attr.type.includes('double') || attr.type.includes('float')) {
                        return !searchValue ? `${attr.name} = ${searchValue}` : null;
                    }
                    return null;
                })
                .filter(Boolean)  // Remove null values
                .join(' OR ');

            if (!cqlFilter) {
                return null;  // Skip this feature type if no valid filters
            }

            const searchUrl = new URL(baseUrl);
            searchUrl.search = new URLSearchParams({
                service: 'WFS',
                version: '2.0.0',
                request: 'GetFeature',
                typeName: typeName,
                CQL_FILTER: cqlFilter,
                outputFormat: 'application/json'
            }).toString();

            return fetch(searchUrl).then(async (response) => {
                const text = await response.text();
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
                }
                try {
                    return JSON.parse(text);
                } catch (error) {
                    throw new Error(`Failed to parse JSON: ${error.message}. Response: ${text}`);
                }
            });
        });

        const searchResults = await Promise.all(searchPromises);
        return searchResults.filter(Boolean).flatMap(result => result.features || []);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            constructSearchQuery(value).then(results => {
                console.log('Search results:', results);
                setSimpleQueryResults(results.length)
                
                if (map && results.length > 0) {
                //     const geojsonFormat = new GeoJSON();
                //     // Read features using the original EPSG:4326 projection
                //     const features = geojsonFormat.readFeatures({ type: "FeatureCollection", features: results }, { featureProjection: 'EPSG:4326' });
                //     setIsTableViewOpen(true)
                //     seTableData(features)
                //     const vectorSource = new VectorSource({
                //         features: features
                //     });

                //    // Change layer color with each query
                //    const newColor = layerColor === 'rgba(255, 0, 0, 1)' ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)'; // Toggle color between red and green
                //    setLayerColor(newColor);

                //    const vectorLayer = new VectorLayer({
                //        title:`Searched features => ${value}`,
                //        source: vectorSource,
                //        style: new Style({
                //            fill: new Fill({
                //                color: 'rgba(255, 255, 0, 0.6)', // Semi-transparent yellow fill
                //            }),
                //            stroke: new Stroke({
                //                color: newColor, // Use the current layer color
                //                width: 2,
                //            }),
                //        }),
                //    });

             
                //     addLayerToMap(vectorLayer); // Add the vector layer to the map
                //     RerenderLayerSwitcherPanel(vectorLayer)

                //     const extent = vectorSource.getExtent();
                //     console.log("Layer extent:", extent);
                //     if (!isEmpty(extent)) {
                //       map.getView().fit(extent, { duration: 1000, maxZoom: 20 });
                //     } else {
                //       console.log("Invalid or empty extent");
                //     }
          
                    
                }
            }).catch(error => {
                console.error('Error during search:', error);
            });
        }
    };

    return (
        <input 
            id="results" 
            value={value}
            onChange={handleValueChange}
            onKeyDown={handleKeyDown}
            style={{ background: "brown" }} 
            placeholder='Search Anything....'
            className="absolute top-2 z-[5000] left-80 p-1 placeholder:text-white placeholder:opacity-100 rounded-md text-md text-white font-bold"
        />
    );
}

export default SimpleQuery;
