import React, { useEffect, useRef } from 'react';
import maplibregl, { Map, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import PathFinder from "geojson-path-finder";
import { point } from "@turf/helpers";
import * as geolib from 'geolib';

import Navbar from '../components/navbar';
import data from '../geojson/data.json';
import buildings from '../geojson/buildings.json';
import water_areas from '../geojson/water_areas.json';
import dataroad from '../geojson/map.json';
import datamap from '../geojson/admin_units_level6.json';
import { createMap } from './mapnew';
import overMap from './topographic';
import { markerImage, zoom } from './markerimage';
import { closeRightPanel, showLocationDetail } from './showinformation';
import { search, updateSuggestions } from './search';


const roads = require('../geojson/road.geojson');


const MapComponent: React.FC = () => {
  useEffect(() => {
    //start map
    const map = createMap();

    //load map
    overMap(map);
  
    // load marker
    map.on('load', () => {
      const marker = markerImage(map);
      search(map, marker);
      const searchInput = document.getElementById('search-input') as HTMLInputElement;

      searchInput.addEventListener('input', ()=> {
        const searchText = searchInput.value;
        const suggestions = data.features.filter(function(feature) {
            return feature.properties.name.toLowerCase().includes(searchText.toLowerCase());
        });
        
        updateSuggestions(suggestions, map, marker);
      });
    });

    //zoom marker
    zoom(map);
    
    //close right panel
    closeRightPanel();
    
    
    
    // update option list
    function updateOptions(options: string[], selectElement: HTMLSelectElement) {
      // delete list
      while (selectElement.firstChild) {
        selectElement.removeChild(selectElement.firstChild);
      }
      //add list address
      options.forEach(function(option) {
        var optionElement = document.createElement('option');
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
      });
    }

    // get the addresses
    const startStreetSelect = document.getElementById('start-street') as HTMLSelectElement;
    const endStreetSelect = document.getElementById('end-street') as HTMLSelectElement;

    const options = data.features.map(feature => feature.properties.name);
    updateOptions(options, startStreetSelect);
    updateOptions(options, endStreetSelect);

    document.getElementById('search-street')?.addEventListener('click', function() {
      const startSelect = document.getElementById('start-street') as HTMLSelectElement;
      const endSelect = document.getElementById('end-street') as HTMLSelectElement;

      const startAddress = startSelect.value;
      const endAddress = endSelect.value;

      const startResults = data.features.filter(function(feature) {
        return feature.properties.name.toLowerCase().includes(startAddress.toLowerCase());
      });

      const endResults = data.features.filter(function(feature) {
        return feature.properties.name.toLowerCase().includes(endAddress.toLowerCase());
      });

      var startPoint= startResults[0].geometry.coordinates;
      console.log('Điểm băt đầu:', startPoint);
      var endPoint = endResults[0].geometry.coordinates;
      console.log('Điểm kết thúc:', endPoint);
      
      const center= startPoint as maplibregl.LngLatLike ;
      map.setCenter(center);
      map.setZoom(16);
      findPath(startPoint,endPoint);
      
    });

    function findPath(startPoint: number[], endPoint: number[]) {
      fetch(roads)
        .then((response) => response.json())
        .then((geojson) => {
          const pathFinder = new PathFinder(geojson);
          const start = point(startPoint);
          const finish = point(endPoint);
          const path = pathFinder.findPath(start, finish);
          if (path) {
            const pathSource = map.getSource('path') as any;
            const coordinates = path.path;
            if (pathSource) {
              pathSource.setData({
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: coordinates,
                },
              });
            } else {
              map.addSource('path', {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: coordinates,
                  },
                },
              });
              map.addLayer({
                id: 'path-layer',
                type: 'line',
                source: 'path',
                paint: {
                  'line-color': '#FA8072',
                  'line-opacity': 1,
                  'line-width': 6,
                },
              });
            }
          } else {
            console.error('Không tìm thấy đường đi.');
        }
      })
      .catch((error) => {
        console.error('Lỗi khi tìm đường:', error);
      });
    }
    
    //search street random
    document.getElementById('search-address')?.addEventListener('click', function() {  
      let clickCount = 0;
      let start: number[] | null = null;
      let end: number[] | null = null;
      map.on('click', function(e) {

        if (map.getLayer('street-id5')) {
          map.removeLayer('street-id5');
        }
        if (map.getSource('datasets5')) {
          map.removeSource('datasets5');
        }

        clickCount++;

        if (clickCount === 1) {
          start = e.lngLat.toArray();
          console.log('Tọa độ lần 1:', start);
        } else if (clickCount === 2) {
          end = e.lngLat.toArray();
          console.log('Tọa độ lần 2:', end);
        } else if (clickCount === 3) {
          start = null;
          end = null;
          clickCount = 0;
          console.log('Tìm điểm bắt đầu lại');
        }

        if (start !== null && end !== null) {
          drawPath(start, end);
        }
      });
    });

    function drawPath(startp: number[], endp: number[]) {
      fetch(roads)
        .then((response) => response.json())
        .then((geojson) => {
          const start =  {
            latitude: startp[1],
            longitude: startp[0],
          };
          let minDistance = Infinity;
          let nearestPoint = null;
          
          const end =  {
            latitude: endp[1],
            longitude: endp[0],
          };
          let minDistance1 = Infinity;
          let nearestPoint1 = null;
          
          geojson.features.forEach((feature: any) => {
            const geometry = feature.geometry;
            if (geometry.type === 'LineString') {
              const lineString = geometry.coordinates;
              const closestPoint = geolib.findNearest(start, lineString) ;
              
              const distance = geolib.getDistance(start, closestPoint);
              if (distance < minDistance) {
                minDistance = distance;
                nearestPoint = closestPoint;
              }
            }
            const geometry1 = feature.geometry;
            if (geometry1.type === 'LineString') {
              const lineString1 = geometry1.coordinates;
              const closestPoint1 = geolib.findNearest(end, lineString1);
              const distance1 = geolib.getDistance(end, closestPoint1);
              if (distance1 < minDistance1) {
                minDistance1 = distance1;
                nearestPoint1 = closestPoint1;
              }
            }
          });

          if (nearestPoint && nearestPoint1) {
            const pathFinder = new PathFinder(geojson);
            const startup = point(nearestPoint);
            const finish = point(nearestPoint1);
            var path = pathFinder.findPath(startup, finish);
            if (path) {
              const network = {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'LineString',
                      coordinates: path.path,
                    },
                  },
                ],
              };
      
              // Thêm nguồn dữ liệu mới và vẽ lớp đường đi
              map.addSource('datasets5', {
                type: 'geojson',
                data: network,
              });
              map.addLayer({
                id: 'street-id5',
                type: 'line',
                source: 'datasets5',
                paint: {
                  'line-color': 'red',
                  'line-opacity': 1,
                  'line-width': 6,
                },
              });
            }
          } else {
            console.log('Không tìm thấy đường đi');
          }
        });
    }
  


    // Xóa bản đồ khi component bị hủy
    return () => map.remove();
  }, []);

  return (
    <div className="map-wrap" >
      <Navbar/>
      
    </div>
  );
};

export default MapComponent;
