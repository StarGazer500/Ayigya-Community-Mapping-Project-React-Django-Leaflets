import logo from './logo.svg';
import './App.css';
import MapComponent from './mapview'

function App() {
  return (
  <MapComponent
  />
  );
}

export default App;
// 'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/ne:projected_mosaic/{z}/{x}/{-y}.png'
// http://localhost:8080/geoserver/gwc/service/tms/1.0.0/ne:projected_mosaic@EPSG:4326@png/{z}/{x}/{-y}.png