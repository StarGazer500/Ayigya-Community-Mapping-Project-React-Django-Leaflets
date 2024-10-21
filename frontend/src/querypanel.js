import React, { useState,useCallback, useEffect} from 'react';
import L from 'leaflet';
import WMSCapabilities from 'wms-capabilities'






function QueryPanel({addLayerToMap ,setIsTableViewOpen,results,setResults,tableData,setTableColumnNames,tableColumnNames,seTableData,isOpen,map}) {
  const [selectedAttribute, setSelectedAttribute] = useState('None');
  const [selectedFeatureLayer, setSelectedFeatureLayer] = useState('All Feature Layers');
  const [selectedQueryType, setSelectedQueryType] = useState('None');
  const [value, setValue] = useState('');
  // const [results, setResults] = useState('');
  const [layers, setLayers] = useState([]);
  const [attributes,setAttributes] = useState(null)
  const [operators,setOperations]= useState([])
  const [error, setError] = useState(null);
  const [geojsonLayer, setGeojsonLayer] = useState(null);
  const [bounds,setBounds] = useState()
  

 

  const handleSelectedAttributeOnChange = (event) => {
    setSelectedAttribute(event.target.value);
  };

  const handleSelectedFeatureLayerOnChange = (event) => {
    setSelectedFeatureLayer(event.target.value);
    
  };

  const handleSelectedQueryTypeOnChange = (event) => {
    setSelectedQueryType(event.target.value);
  };

  const handleValueChange = (event) => {
    setValue(event.target.value);
  };

  const handleResultsChange = (event) => {
    setResults(event.target.value);
  };


 

  async function getAttributeNames(layer) {
    try {
        const response = await fetch(
            `http://localhost:8080/geoserver/nurc/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName=${layer}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const text = await response.text(); // Get the response as text
        console.log(response)
        const xml = new window.DOMParser().parseFromString(text, 'text/xml');
        const attrs = [];
        
        

        const elements = xml.getElementsByTagName('xsd:element');
        
        for (let i = 0; i < elements.length; i++) {
            const value = elements[i].getAttribute('name');
            const type = elements[i].getAttribute('type');
            
           
            if (value !== 'geom' && value !== 'the_geom' && type!==layer+"Type") {
                attrs.push({ name: value, type})
                
            }
        }

        setAttributes(attrs); // Ensure setAttributes is defined in the appropriate scope
        return attrs
    } catch (error) {
        console.error('Error fetching attributes:', error);
        alert('Error retrieving attributes from the server.');
    }
}



async function getData(layerName, map) {
  const baseUrl = 'http://localhost:8080/geoserver/ows';
  const params = new URLSearchParams({
    service: 'WFS',
    version: '1.0.0',
    request: 'GetFeature',
    typeName: layerName,
    outputFormat: 'application/json'
  });
  const url = `${baseUrl}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("GeoJSON data received:", data);

    // Create a Leaflet GeoJSON layer
    const geoJsonLayer = L.geoJSON(data, {
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
    

   

    // Fit the map to the GeoJSON layer's bounds
    const bounds = geoJsonLayer.getBounds()
    const latLngBounds = [
      [bounds._southWest.lat, bounds._southWest.lng], // Southwest corner
      [bounds._northEast.lat, bounds._northEast.lng]  // Northeast corner
  ]

  setBounds(latLngBounds)

  console.log("bounds",latLngBounds)

    console.log("Features loaded:", data.features.length);
    setResults(data.features.length);

    if (data.features.length > 0) {
      // Update tableData with the new features
      seTableData(data.features);
      console.log("Data Retrieved Successfully",);
      console.log("First feature geometry:", data.features[0].geometry.coordinates);
      return data.features; // Return the features if any are found
    } else {
      console.log("No features found for the query.");
      return []; // Return an empty array if no features are found
    }
  } catch (error) {
    console.error("Error fetching GeoJSON data:", error);
    return null; // Return null or handle the error as needed
  } finally {
    console.log("Map projection:", 'EPSG:3857'); // Leaflet uses Web Mercator by default
  }
}

// Usage:
// getData('your_layer_name', mapInstance)
//   .then(features => {
//     if (features) {
//       console.log('Features loaded:', features.length);
//     }
//   })
//   .catch(error => console.error('Error:', error));

 const filterQuery = useCallback(() => {
    if (!map) return;

    if (geojsonLayer) {
      map.removeLayer(geojsonLayer);
    }

    let value_txt = value;
    if (selectedQueryType === 'ILike') {
      value_txt = `'%${value_txt}%'`;
    } else {
      value_txt = `'${value_txt}'`;
    }

    const baseUrl = 'http://localhost:8080/geoserver/ows';
    const params = new URLSearchParams({
      service: 'WFS',
      version: '1.0.0',
      request: 'GetFeature',
      typeName: selectedFeatureLayer,
      CQL_FILTER: `${selectedAttribute} ${selectedQueryType} ${value_txt}`,
      outputFormat: 'application/json'
    });

    const url = `${baseUrl}?${params.toString()}`;
    console.log("Request URL:", url);

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("GeoJSON data received:", data);

        

        const geoJsonData = L.geoJSON(data, {
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

        console.log("Features loaded:", data.features.length);
        setResults(data.features.length)

        if (data.features.length > 0) {
          seTableData(data.features)

          addLayerToMap(geoJsonData)
         
          setGeojsonLayer(geoJsonData);

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
        else {
          console.log("No features found for the query.");
        }
      })
      .catch(error => {
        console.error("Error fetching GeoJSON data:", error);
      });

    // console.log("Map projection:", map.getView().getProjection().getCode());
  }, [map, geojsonLayer, selectedFeatureLayer, selectedAttribute, selectedQueryType, value]);



 

  async function getWmsLayerExtent(layerName) {
    const baseUrl = 'http://localhost:8080/geoserver/nurc/wms?';
    const workspace = 'nurc'
    try {
        // Construct the WMS capabilities request URL
        const response = await fetch(`${baseUrl}SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities`);
        const text = await response.text();
        const parser = new WMSCapabilities();
        const result = parser.read(text);
        console.log("results",result)

        // Retrieve the geographic bounding box for the specified layer
        const fullLayerName = `${workspace}:${layerName}`;
        const layer = result.Capability.Layer.Layer.find(l => l.Name === fullLayerName);
        
        if (layer && layer.EX_GeographicBoundingBox) {
            const extent = layer.EX_GeographicBoundingBox;
            return extent; // Return the extent in EPSG:4326
        } else {
            console.error('Layer not found or no bounding box available.');
            return null; // Return null if the layer is not found
        }
    } catch (error) {
        console.error('Error fetching WMS capabilities:', error);
        return null; // Return null in case of an error
    }
}





// Example usage







// Function to create a WMS layer
const createWMSLayer = (layerName) => {
  const wmsLayer = L.tileLayer.wms('http://localhost:8080/geoserver/nurc/wms', {
    layers: layerName,
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    tiled: true,
    opacity: 1,
    zIndex: 1000,
  });
  wmsLayer.options.title = layerName;
  return wmsLayer;
};
 


  const  handleQuery = async() => {
   
    if(selectedFeatureLayer ==="All Feature Layers" & selectedAttribute ==="None" & selectedQueryType ==="None"){
        console.log("Clicked")
        // tableData.length = 0
        // tableColumnNames.length = 0
      // const allAttributes= []
       
      for (let i = 0; i < layers.length; i++) {
        let newLayer = createWMSLayer(layers[i].name);
        console.log("layer", newLayer);
        addLayerToMap(newLayer);
        console.log("map",map)
        
        // Uncomment and adjust these lines if you need to fetch additional data
        // var columnData = await getAttributeNames("nurc:"+layers[i].name);
        // allAttributes.push(...columnData);
        // await getData("nurc:"+layers[i].name);
      }
        
        // setTableColumnNames(...new Set(allAttributes))
      
      //  await zoomToFitAllLayers() 
        
   
    }else if (selectedFeatureLayer !=="All Feature Layers" & selectedAttribute ==="None" & selectedQueryType ==="None"){
      tableData.length = 0
      // map.addLayer(await createWMSLayer(selectedFeatureLayer));
      var newLayer = createWMSLayer(selectedFeatureLayer)
      await getAttributeNames("nurc:"+selectedFeatureLayer)
      setTableColumnNames(attributes)
      const data = await getData("nurc:"+selectedFeatureLayer)
      
      console.log("getdata",data)
      setIsTableViewOpen(true)
      addLayerToMap(newLayer)
      // map.fitBounds(bounds)
      
      // layerSwitcherRef.current.addOverlay(newLayer)
      

        // Zoom to the extent of the new WMS layer
        // const extent = await  getWmsLayerExtent(selectedFeatureLayer);
        // console.log(extent)
       
        // const bounds = [
        //   [extent.southBoundLatitude, extent.westBoundLongitude], // Southwest corner
        //   [extent.northBoundLatitude, extent.eastBoundLongitude]  // Northeast corner
        // ];
        // map.fitBounds(bounds)
      
        // if (extent) {
        //     map.getView().fit(extent, {
        //         duration: 1000, // Animation duration
        //         Zoom: 20, // Optional: Set a maximum zoom level
        //     });
        //   }
      }else if (selectedFeatureLayer !=="All Feature Layers" & selectedAttribute !=="None" & selectedQueryType !=="None"){
        tableData.length = 0
        const data1 = await getAttributeNames("nurc:"+selectedFeatureLayer)
        setTableColumnNames(data1)
        // const filterquery
        setIsTableViewOpen(true)
        filterQuery()
        
      }else if (selectedFeatureLayer ==="All Feature Layers" & selectedAttribute !=="None" & selectedQueryType ==="None"){
       console.log("please select an operator")
      }else if (selectedFeatureLayer ==="All Feature Layers" & selectedAttribute ==="None" & selectedQueryType !=="None"){
        console.log("please select an Attribute")
       }else if (selectedFeatureLayer !=="All Feature Layers" & selectedAttribute ==="None" & selectedQueryType ==="None"){
        console.log("Selecting None for both attribute and operators requires to select , All features Layers in the feature layer")
       }else {
        console.log(selectedFeatureLayer,selectedAttribute,selectedQueryType)
        console.log("unknown logic fix")
       }        
}

async function SetOperations(attribute){
  console.log("att",attribute)
  if (attribute !== null && attribute !== "None" && attribute !== undefined){
    const attr = attributes.find(attr => attr.name === attribute)
    const datatype = attr.type
    console.log(datatype)
    if (datatype ==="xsd:decimal" | datatype ==="xsd:double" | datatype ==="xsd:long"){
      var operat = [{text:'Greater than',sign:'>'},{text:'Less than',sign:'<'},{text:'Equal to',sign:'='},{text:'Between',sign:'between'}] 
       setOperations(operat)

    }else if (datatype ==="xsd:string"){
      setOperations([{text:"Equals",sign:"ILike"}])
  
    }else if (datatype ==="xsd:date"){
      console.log("to be handled later")
    }

  }
}

useEffect(() => {
  if (bounds) {
      // Make sure bounds are valid before calling fitBounds
      map.fitBounds(bounds);
  }
}, [bounds])

  // Log selected values whenever they change
  useEffect(() => {
    getAttributeNames("nurc:"+selectedFeatureLayer)
    console.log("Selected Feature Layer:", selectedFeatureLayer);
    
  }, [selectedFeatureLayer]);

  useEffect(() => {
    
    SetOperations(selectedAttribute)
    
  }, [selectedAttribute]);

  useEffect(() => {
    console.log("Selected Query Type:", selectedQueryType);
  }, [selectedQueryType]);

  useEffect(() => {
    const fetchWmsLayers = async () => {
      try {
        const response = await fetch('http://localhost:8080/geoserver/nurc/wms?request=getCapabilities');
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        
        const layersData = Array.from(xml.querySelectorAll('Layer > Layer')).map(layer => ({
          name: layer.querySelector('Name')?.textContent || '',
          title: layer.querySelector('Title')?.textContent || '',
          abstract: layer.querySelector('Abstract')?.textContent || ''
        }));
  
        setLayers(layersData);
        setError(null);
      } catch (err) {
        console.error('Error fetching WMS layers:', err);
        setError('Failed to fetch WMS layers. Please try again.');
      }
    }
      fetchWmsLayers()
    
    
  }, []);

  if (!isOpen) return null;
  
 

  return (
    <div className="flex w-1/4 flex-col mt-0 pt-0 h-3/4" >
      <div className="flex flex-col items-left bg-white p-2">
        <label htmlFor="feature-layer" className="mb-2">Select Feature Layer:</label>
        <select 
          id="feature-layer" 
          onChange={handleSelectedFeatureLayerOnChange} 
          value={selectedFeatureLayer} 
          className="border rounded p-2 mb-2"
        >
          <option value="All Feature Layers">All Feature Layers</option>
           {layers.map((layer, index) => (<option key ={index} value={layer.name}>{layer.name}</option>))}
          {/* <option value="All Feature Layers">All Feature Layers</option> */}
          {/* Add more options here */}
        </select>

        <label htmlFor="attribute" className="mb-2">Select Attribute:</label>
        <select 
          id="attribute" 
          onChange={handleSelectedAttributeOnChange} 
          value={selectedAttribute} 
          className="border rounded p-2 mb-2"
        >
          <option value="None">None</option>
          {attributes.map((attribute, index) => (<option key ={index} value={attribute.name}>{attribute.name}</option>))}
          {/* Add more options here */}
        </select>

        <label htmlFor="query-type" className="mb-2">Select Query Type:</label>
        <select 
          id="query-type" 
          onChange={handleSelectedQueryTypeOnChange} 
          value={selectedQueryType} 
          className="border rounded p-2 mb-2"
        >
          <option value="None">None</option>
          {operators.map((operator, index) => (<option key ={index} value={operator.sign}>{operator.text}</option>))}
        
          {/* Add more options here */}
        </select>

        <label htmlFor="value" className="mb-2">Enter Value:</label>
        <input 
          id="value" 
          value={value}
          onChange={handleValueChange}
          className="border rounded p-2 mb-2"
        />

        <label htmlFor="results" className="mb-2">Number of Results Returned:</label>
        <input 
          id="results" 
          value={results}
          onChange={handleResultsChange}
          className="border rounded p-2 mb-2"
        />

<button onClick={handleQuery} className="mt-2" style={{ width: "60px", borderRadius: "2px", color: "white", background: "brown" }}>Query</button>
      </div>
    </div>
  );
}


export default QueryPanel;