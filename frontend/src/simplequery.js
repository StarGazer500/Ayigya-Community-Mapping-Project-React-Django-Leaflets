import React, { useState,useEffect } from 'react';
import L from 'leaflet';


function SimpleQuery({addLayerToMap, setSimpleQueryResults,setIsTableViewOpen,map,setTableColumnNames,seTableData }) {
    const [value, setValue] = useState('');
    const [layerColor, setLayerColor] = useState('rgba(255, 0, 0, 1)'); 
    const [bounds,setBounds] = useState()
   

    const handleValueChange = (event) => {
        setValue(event.target.value);
    };

    useEffect(() => {
        if (bounds) {
            // Make sure bounds are valid before calling fitBounds
            map.fitBounds(bounds);
        }
      }, [bounds])

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
                seTableData(results)
                console.log(results.length > 0)
                if (results.length > 0) {
                    const geoJsonData = L.geoJSON(results, {
                        style: function (feature) {
                          return { color: 'blue' }; // You can customize the style here
                        },
                        onEachFeature: function (feature, layer) {
                          // You can add popups or tooltips here
                          if (feature.properties) {
                            layer.bindPopup(Object.keys(feature.properties).map(key => 
                              feature.properties[key]!==null?`${key}: ${feature.properties[key]}`:null
                            ).join('<br>'));
                          }
                        }
                      });

                      console.log("geojsondata",geoJsonData)
                   
                    
                    setIsTableViewOpen(true)
                
               

             
                    addLayerToMap(geoJsonData); // Add the vector layer to the map
                

                    const extent = geoJsonData.getBounds();
                    const latLngBounds = [
                      [extent._southWest.lat, extent._southWest.lng], // Southwest corner
                      [extent._northEast.lat, extent._northEast.lng]  // Northeast corner
                  ]
                    console.log("extends",extent)
                    console.log("Layer extent:", latLngBounds);
                    if (extent) {
                      setBounds(latLngBounds)
                    } else {
                      console.log("Invalid or empty extent");
                    }
                    
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
