import { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import data from '../geojson/data.json';
const roads = require('../geojson/road.geojson');
const datamap = require('../geojson/admin_units_level6.geojson');
const buildings = require('../geojson/buildings.geojson');
const water_areas = require('../geojson/water_areas.geojson');

function overMap(map: Map){
  map.on('load',(e)=>{
    map.addSource("datasets", {
      type: "geojson",
      data: datamap
    });
  
    map.addLayer({
        id: "datasets-id",
        type: "fill",
        source: "datasets",
        paint: {
        "fill-color": "Silver",
        "fill-opacity": 1,
        },
    });
    map.addSource('buildings', {
      type: 'geojson',
      data: buildings
    });
  
    map.addLayer({
        id: 'buildings-id',
        type: 'fill',
        source: 'buildings',
        paint: {
        'fill-color': 'black',
        'fill-opacity': 1
        }
    });
  
    map.addSource('water_areas', {
        type: 'geojson',
        data: water_areas
    });
  
    map.addLayer({
        id: 'water_areas-id',
        type: 'fill',
        source: 'water_areas',
        paint: {
        'fill-color': '#66B2FF',
        'fill-opacity': 1
        }
    });
  
    map.addSource("street", {
        type: "geojson",
        data: roads,
    });
  
    map.addLayer({
        id: "street-id",
        type: "line",
        source: "street",
        paint: {
        "line-color": "#0066CC",
        "line-opacity": 1,
        "line-width": 2,
        },
    });
    map.addSource('vin-src',{
      type:'geojson',
      data:data
    })
  
    map.addLayer({
      id: 'vin-name',
      type: 'symbol',
      source: 'vin-src',
      layout: {
        'text-field': ['format', ['get', 'name'], { 'font-scale': 1 }],
        'text-size': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15, 0, 15.5, 4, 16, 6, 16.5, 8, 17, 10, 17.5, 12, 18, 14, 18.5, 16, 19, 18
        ],
        'text-offset': [0, 3],
        'text-anchor': 'top'
      },
      paint: {
        'text-color': 'black'
      }
    });
  });
}

export default overMap;