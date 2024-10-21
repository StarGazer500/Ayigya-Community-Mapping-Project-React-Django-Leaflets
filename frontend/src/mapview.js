import React, { useState,useEffect, useRef } from 'react';
import QueryPanel from './querypanel'
import SimpleQuery from './simplequery'
import DetailsTableView from './tableview'
// import Legend from "./lengends"
import LayerSwitcher from "./layerswitcher"

import {
  MapContainer,
  TileLayer,
  LayersControl,
  useMap
} from 'react-leaflet';
import L, { map } from 'leaflet';

// Fix Leaflet's icon path issues for webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const { BaseLayer } = LayersControl;

export function MapComponent() {

  const mapRef = useRef()
  const [geolocation, setGeolocation] = useState(null);
  const [marker, setMarker] = useState(null);
  const [isOpen, setIsOpen] = useState(false)

  const [tableColumnNames,setTableColumnNames] = useState([])
  const [tableData,seTableData] = useState([])
  const [results, setResults] = useState('');
  const [isTableViewOpen,setIsTableViewOpen] = useState(false)
  const [simpleQueryResults,setSimpleQueryResults] = useState(null)
  // const popupRef = useRef();
  const [currentPosition] = useState([6.69145, -1.57465]);

  const addLayerToMap = (layer) => {
    if (mapRef.current && layer && !mapRef.current.hasLayer(layer)) {
      mapRef.current.addLayer(layer);
      // mapRef.current.invalidateSize();
      console.log(`Layer ${layer.options.title} added to map`);
    }
  };

  useEffect(() => {
    if (mapRef.current) {
    
      console.log("set map is",mapRef.current)
      // Do something with the map
    }
  }, [mapRef.current]);

  return (
    <div className="flex flex-col w-full h-screen" >

      <div style={{ background: 'brown' }} className="mb-0 pb-0">
          <h1 className="font-bold text-6xl pb-0 mb-0 text-white">Ayigya Community Map View</h1>
      </div>
<     div className="flex flex-col flex-1 overflow-hidden">
<       div className="flex flex-1">
      <QueryPanel addLayerToMap = {addLayerToMap}  setIsTableViewOpen ={setIsTableViewOpen} results = {results} setResults = {setResults} tableData = {tableData} tableColumnNames={tableColumnNames} setTableColumnNames = {setTableColumnNames} seTableData = {seTableData}  isOpen={isOpen} map={mapRef.current} />
      
    <div className="flex-1 relative">
    <LayerSwitcher map = {mapRef.current}/>
    <button
              style={{ zIndex: 4000 }}
              onClick={() => setIsOpen(!isOpen)}
              className="absolute top-2 left-20 p-1 rounded-md text-md text-white font-bold bg-[#CD4631]"
            >
              {isOpen ? "Hide Advanced Query" : "Open Advanced Query"}
            </button>
            <SimpleQuery  addLayerToMap = {addLayerToMap}  setIsTableViewOpen = {setIsTableViewOpen} setSimpleQueryResults = {setSimpleQueryResults} setTableColumnNames = {setTableColumnNames} seTableData = {seTableData} map={mapRef.current} />
            <div className="h-full bg-grey relative">
            <MapContainer 
              center={currentPosition} 
              zoom={20} 
              // style={{ height: "100vh", width: "100%" }} 
              className="w-full h-full  bg-grey"
              scrollWheelZoom={true}
              ref = {mapRef}
            
             
            >
              <LayersControl position="topright">
                <BaseLayer  name="OpenStreetMap">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                </BaseLayer>
                <BaseLayer name="Google Satellite">
                  <TileLayer
                    url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                    attribution='&copy; Google'
                  />
                </BaseLayer>
                <BaseLayer checked name="Google Satellite Hybrid">
                  <TileLayer
                    url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                    attribution='&copy; Google'
                  />
                </BaseLayer>
              </LayersControl>
            </MapContainer>
            </div>
             {/* <Legend  map={mapRef.current} />  */}
            {simpleQueryResults?<div ><h2 style={{color:"white"}} className='absolute z-[9000] font-bold  bg-red-500 p-1 rounded-md  bottom-2 left-2'>{simpleQueryResults} Results Returned</h2></div>:null} 
            </div>
        </div>
        {isTableViewOpen?<DetailsTableView map = {mapRef.current} tableColumnNames = {tableColumnNames} tableData= {tableData}/>:null}
      </div>
    </div>
  );
}

export default MapComponent;