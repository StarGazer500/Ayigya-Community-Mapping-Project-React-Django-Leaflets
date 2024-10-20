import React, { useState,useCallback, useEffect} from 'react';




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

async function getData(layername) {
  const baseUrl = 'http://localhost:8080/geoserver/ows';
  const params = new URLSearchParams({
    service: 'WFS',
    version: '1.0.0',
    request: 'GetFeature',
    typeName: layername,
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

    // Create a GeoJSON format instance
    // const geojsonFormat = new GeoJSON();

    // // Read features as a FeatureCollection
    // const features = geojsonFormat.readFeatures(
    //   { type: "FeatureCollection", features: data.features }, 
    //   { featureProjection: 'EPSG:4326' }
    // );

    // console.log("Features loaded:", features.length);
    // setResults(features.length);

    // if (features.length > 0) {
    //   // Update tableData with the new features
    //   seTableData(features);
    //   console.log("Data Retrieved Successfully");
    //   console.log("First feature geometry:", features[0].getGeometry().getCoordinates());
    //   return features; // Return the features if any are found
    // } else {
    //   console.log("No features found for the query.");
    //   return []; // Return an empty array if no features are found
    // }
  } catch (error) {
    console.error("Error fetching GeoJSON data:", error);
    return null; // Return null or handle the error as needed
  } finally {
    console.log("Map projection:", map.getView().getProjection().getCode());
  }
}

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

        

        // const features = new GeoJSON().readFeatures(
        //   { type: "FeatureCollection", features: data.features }, 
        //   { featureProjection: 'EPSG:4326' }
        // );

        // console.log("Features loaded:", features.length);
        // setResults(features.length)

        // if (features.length > 0) {
        //   seTableData(features)
          
          // const vectorSource = new VectorSource({
          //   features: features
          // });

          // const newGeojsonLayer = new VectorLayer({
          //   source: vectorSource,
          //   title:selectedFeatureLayer,
          //   style: new Style({
          //     fill: new Fill({ color: 'rgba(255, 255, 255, 0.2)' }),
          //     stroke: new Stroke({ color: '#ffcc33', width: 3 }),
          //     image: new Circle({ radius: 7, fill: new Fill({ color: '#ffcc33' }) }),
          //   }),
          // });

          // addLayerToMap(newGeojsonLayer)
         
          // setGeojsonLayer(newGeojsonLayer);

          // const extent = vectorSource.getExtent();
          // console.log("Layer extent:", extent);
          // if (!isEmpty(extent)) {
          //   map.getView().fit(extent, { duration: 1000, maxZoom: 20 });
          // } else {
          //   console.log("Invalid or empty extent");
          // }

          // console.log("First feature geometry:", features[0].getGeometry().getCoordinates());
        // } 
        // else {
        //   console.log("No features found for the query.");
        // }
      })
      .catch(error => {
        console.error("Error fetching GeoJSON data:", error);
      });

    // console.log("Map projection:", map.getView().getProjection().getCode());
  }, [map, geojsonLayer, selectedFeatureLayer, selectedAttribute, selectedQueryType, value]);

  async function getWmsLayerExtent(layerName) {
    // const baseUrl = 'http://localhost:8080/geoserver/nurc/wms?';

    // try {
    //     const response = await fetch(baseUrl + 'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities');
    //     const text = await response.text();
    //     const parser = new WMSCapabilities();
    //     const result = parser.read(text);

    //     // Retrieve the geographic bounding box for the specified layer
    //     const layer = result.Capability.Layer.Layer.find(l => l.Name === layerName);
    //     if (layer && layer.EX_GeographicBoundingBox) {
    //         const extent = layer.EX_GeographicBoundingBox;
    //         return extent; // Return the extent in EPSG:4326
    //     } else {
    //         console.error('Layer not found or no bounding box available.');
    //         return null; // Return null if the layer is not found
    //     }
    // } catch (error) {
    //     console.error('Error fetching WMS capabilities:', error);
    //     return null; // Return null in case of an error
    // }
}

// const layerExists = (layerName) => {
//   if (!map) return false;
  
//   return map.getLayers().getArray().some(layer => {
//     if (layer instanceof LayerGroup) {
//       return layer.getLayers().getArray().some(subLayer => 
//         subLayer.getSource() instanceof ImageWMS &&
//         subLayer.getSource().getParams().LAYERS === layerName
//       );
//     }
//     return layer.getSource() instanceof ImageWMS &&
//            layer.getSource().getParams().LAYERS === layerName;
//   });
// };

// const zoomToFitAllLayers = () => {

//   if (!map) return;

//   let overallExtent = createEmpty();
//   let hasValidExtent = false;

//   map.getLayers().forEach(layer => {
//     // Skip WMTS layers and base OSM layer
//     if (layer.getSource() instanceof WMTS) {
//       return;
//     }

//     if (layer.getVisible()) {
//       let layerExtent;
//       if (layer instanceof VectorLayer) {
//         const source = layer.getSource();
//         if (source.getFeatures().length > 0) {
//           layerExtent = source.getExtent();
//         }
//       } else if (layer instanceof ImageLayer || layer instanceof TileLayer) {
//         layerExtent = layer.getExtent();
//       }

//       if (layerExtent && 
//           !isEmpty(layerExtent) && 
//           layerExtent.every(coord => isFinite(coord) && !isNaN(coord))) {
//         extend(overallExtent, layerExtent);
//         hasValidExtent = true;
//       }
//     }
//   });

//   if (hasValidExtent) {
//     const center = getCenter(overallExtent);
//     const view = map.getView();
//     const currentZoom = view.getZoom();
    
//     // Zoom out slightly to ensure content is visible
//     const newZoom = Math.max(currentZoom - 1, 0);

//     view.animate({
//       center: center,
//       zoom: newZoom,
//       duration: 1000
//     });

//     console.log('Zooming to center:', center, 'with zoom level:', newZoom);
//   } else {
//     console.warn("No valid extents found for visible non-WMTS layers.");
//   }
// };


const createWMSLayer = async (layerName) => {
  // if (!layerExists(layerName)) {
  //   return new ImageLayer({
  //     source: new ImageWMS({
  //       url: 'http://localhost:8080/geoserver/nurc/wms',
  //       params: {
  //         'LAYERS': layerName,
  //         'TILED': true,
  //       },
  //       serverType: 'geoserver',
  //       crossOrigin: 'anonymous',
  //     }),
  //     title: layerName,
  //   });
  // }
  // return null;
};

 


  const  handleQuery = async() => {
   
    if(selectedFeatureLayer ==="All Feature Layers" & selectedAttribute ==="None" & selectedQueryType ==="None"){
        console.log("Clicked")
        // tableData.length = 0
        // tableColumnNames.length = 0
      // const allAttributes= []
       
        for (var i=0; i<layers.length;i++){
          
            let newLayer1 = await createWMSLayer(layers[i].name)
          
            // var columnData = await getAttributeNames("nurc:"+layers[i].name)
            
              // allAttributes.push(...columnData); // Set attributes if the array is empty
            
            
         
            // await getData("nurc:"+layers[i].name)
            
            await addLayerToMap(newLayer1)
            
            
        }
        
        // setTableColumnNames(...new Set(allAttributes))
      
      //  await zoomToFitAllLayers() 
        
   
    }else if (selectedFeatureLayer !=="All Feature Layers" & selectedAttribute ==="None" & selectedQueryType ==="None"){
      tableData.length = 0
      // map.addLayer(await createWMSLayer(selectedFeatureLayer));
      var newLayer = await createWMSLayer(selectedFeatureLayer)
      await getAttributeNames("nurc:"+selectedFeatureLayer)
      setTableColumnNames(attributes)
      const data = await getData("nurc:"+selectedFeatureLayer)
      
      console.log("getdata",data)
      setIsTableViewOpen(true)
      await addLayerToMap(newLayer)
      
      // layerSwitcherRef.current.addOverlay(newLayer)
      

        // Zoom to the extent of the new WMS layer
        const extent = await  getWmsLayerExtent("nurc:"+selectedFeatureLayer);
      
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