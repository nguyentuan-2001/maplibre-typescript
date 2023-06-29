import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
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
import MapStart from './mapstart';
import {MapSt} from './mapst';
const roads = require('../geojson/road.geojson');

const MapComponent: React.FC = () => {
  useEffect(() => {
    const map = createMap();
    
    

    map.on('load', () => {
      for (const feature of data.features) {
        const el = document.createElement('div');
          el.className = 'marker';

          const img = document.createElement('img');
          img.src = feature.properties.image_url_1;
          img.className = 'marker-image';
          img.style.cursor = 'pointer';
          img.style.width = feature.properties.iconSize[0] + 'px';
          img.style.height = feature.properties.iconSize[1] + 'px';
          img.style.borderRadius = '50px';

          el.appendChild(img);

          const marker = new maplibregl.Marker(el)
            .setLngLat(feature.geometry.coordinates as maplibregl.LngLatLike)
            .addTo(map)
            .getElement()
            .addEventListener('click', createMarkerClickHandler(feature));

        document.getElementById('shopping')?.addEventListener('change', function() {
          const shoppingCheckbox = this as HTMLInputElement;
          if (shoppingCheckbox.checked) {
            map.setFilter('vin-name', ['==', ['get', 'type'], 'shopping']);
          } else {
            map.setFilter('vin-name', null);
          }
          if (feature.properties.type === 'shopping') {
            el.style.display = 'block';
          }
          else if (feature.properties.type === 'restaurant') {
            el.style.display = 'none';
          }
          else if (feature.properties.type === 'atraction') {
            el.style.display = 'none';
          }
        });

        document.getElementById('restaurant')?.addEventListener('change', function() {
          const restaurantCheckbox = this as HTMLInputElement;
          if (restaurantCheckbox.checked) {
            map.setFilter('vin-name', ['==', ['get', 'type'], 'restaurant']);
          } else {
            map.setFilter('vin-name', null);
          }
          if (feature.properties.type === 'shopping') {
            el.style.display = 'none';
          }
          else if (feature.properties.type === 'restaurant') {
            el.style.display = 'block';
          }
          else if (feature.properties.type === 'atraction') {
            el.style.display = 'none';
          }
        });

        document.getElementById('atraction')?.addEventListener('change', function() {
          const atractionCheckbox = this as HTMLInputElement;
          if (atractionCheckbox.checked) {
            map.setFilter('vin-name', ['==', ['get', 'type'], 'atraction']);
          } else {
            map.setFilter('vin-name', null);
          }
          if (feature.properties.type === 'atraction') {
            el.style.display = 'block';
          }
          else if (feature.properties.type === 'shopping') {
            el.style.display = 'none';
          }
          else if (feature.properties.type === 'restaurant') {
            el.style.display = 'none';
          }
        });

        document.getElementById('all')?.addEventListener('change', function() {
          const allCheckbox = this as HTMLInputElement;
          if (allCheckbox.checked) {
            map.setFilter('vin-name', null);
            el.style.display = 'block';
          }
        });

      }
    });
    map.on("zoom", () => {
      for (const feature of data.features) {
        const marker = new maplibregl.Marker().setLngLat(feature.geometry.coordinates as maplibregl.LngLatLike);
        const el = marker.getElement();
        
        // Lấy độ zoom hiện tại của bản đồ
        const currentZoom = map.getZoom();
        
        // Lấy kích thước ban đầu của hình ảnh
        const width = 40;
        const height = 40;
    
        const imgElements = document.querySelectorAll<HTMLImageElement>(".marker-image");
        let newWidth: number, newHeight: number;
        
        // Tính toán kích thước mới dựa trên độ zoom hiện tại của bản đồ
        imgElements.forEach((imgElement) => {
          if (currentZoom <= 15) {
            newWidth = 0;
            newHeight = 0;
    
            imgElement.addEventListener("mouseover", function () {
              // Tăng kích thước của thẻ khi con trỏ chuột hover vào
              imgElement.style.width = "0px";
              imgElement.style.height = "0px";
            });
            imgElement.addEventListener("mouseout", function () {
              // Khôi phục kích thước ban đầu
              imgElement.style.width = "0px";
              imgElement.style.height = "0px";
            });
    
          } else if (currentZoom > 15 && currentZoom < 15.5) {
            newWidth = width * 0.1;
            newHeight = height * 0.1;
    
            imgElement.addEventListener("mouseover", function () {
              // Tăng kích thước của thẻ khi con trỏ chuột hover vào
              imgElement.style.width = "8px";
              imgElement.style.height = "8px";
            });
            imgElement.addEventListener("mouseout", function () {
              // Khôi phục kích thước ban đầu
              imgElement.style.width = "4px";
              imgElement.style.height = "4px";
            });
    
          } else if (currentZoom > 15.5 && currentZoom < 16.5) {
            newWidth = width * 0.5;
            newHeight = height * 0.5;
    
            imgElement.addEventListener("mouseover", function () {
              // Tăng kích thước của thẻ khi con trỏ chuột hover vào
              imgElement.style.width = "40px";
              imgElement.style.height = "40px";
            });
            imgElement.addEventListener("mouseout", function () {
              // Khôi phục kích thước ban đầu
              imgElement.style.width = "20px";
              imgElement.style.height = "20px";
            });
    
          } else if (currentZoom > 16.5 && currentZoom < 17.5) {
            newWidth = width;
            newHeight = height;
    
            imgElement.addEventListener("mouseover", function () {
              // Tăng kích thước của thẻ khi con trỏ chuột hover vào
              imgElement.style.width = "70px";
              imgElement.style.height = "70px";
            });
            imgElement.addEventListener("mouseout", function () {
              // Khôi phục kích thước ban đầu
              imgElement.style.width = "40px";
              imgElement.style.height = "40px";
            });
    
          } else if (currentZoom > 17.5 && currentZoom < 19) {
            newWidth = width * 1.6;
            newHeight = height * 1.6;
    
            imgElement.addEventListener("mouseover", function () {
              // Tăng kích thước của thẻ khi con trỏ chuột hover vào
              imgElement.style.width = "100px";
              imgElement.style.height = "100px";
            });
            imgElement.addEventListener("mouseout", function () {
              // Khôi phục kích thước ban đầu
              imgElement.style.width = "64px";
              imgElement.style.height = "64px";
            });
    
          }
          
          // Cập nhật kích thước của hình ảnh
          imgElement.style.width = `${newWidth}px`;
          imgElement.style.height = `${newHeight}px`;
        });
      }
    });

    // open table information
    function openRightPanel() {
      const elm = document.querySelector<HTMLElement>(".wrapper .right-panel");
      if (elm) {
        elm.style.transform = "translateX(0%)";
      }
    }
    
    function closeRightPanel() {
      const elm = document.querySelector<HTMLElement>(".wrapper .right-panel");
      if (elm) {
        elm.style.transform = "translateX(100%)";
      }
    }
    
    document.getElementById('closeRight')?.addEventListener('click', function() {
      closeRightPanel();
    });
    
    function showLocationDetail(location: any) {
      const name = location.properties.name;
      const listul = document.getElementById("listul") as HTMLDivElement;
      if (listul) {
        listul.innerHTML = name;
      }
      
      const img = location.properties.image_url_2;
      const imgAddress = document.getElementById("img-address") as HTMLImageElement;
      if (imgAddress) {
        imgAddress.src = img;
      }
      
      const desc = location.properties.desc;
      const accordionex = document.getElementById("accordionex") as HTMLDivElement;
      if (accordionex) {
        accordionex.innerHTML = desc;
      }
      
      openRightPanel();
    }
    
    var marker: maplibregl.Marker;
    map.on('load', () => {
      marker = new maplibregl.Marker({color: "#FF0000",draggable: true,anchor: "bottom"})
      .setLngLat([ 109.240512, 12.218791 ])
      .addTo(map);
    });
    
    function createMarkerClickHandler(feature: any) {
      return function() {
        // Event click on marker
        showLocationDetail(feature);
        const lngLat = feature.geometry.coordinates;
        marker.setLngLat(lngLat);
        map.setCenter(lngLat);
        map.setZoom(18);
      };
    }

    //search input
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    searchInput.addEventListener('change', () => {
      const searchText = searchInput.value;
      const allAddress = data.features.filter((feature: any) => {
        return feature.properties.name.toLowerCase().includes(searchText.toLowerCase());
      });

      function getBounds(features: any[]) {
        const bounds = new maplibregl.LngLatBounds();
        features.forEach((feature: any) => {
          bounds.extend(feature.geometry.coordinates);
        });
        return bounds;
      }

      if (allAddress.length > 0) {
        const firstAddress = allAddress[0];
        const lngLat: [number, number] = firstAddress.geometry.coordinates as [number, number];
        if (marker) {
          marker.setLngLat(lngLat);
          map.setCenter(lngLat);
          map.setZoom(18);
          map.fitBounds(getBounds(allAddress), {
            padding: 50
          });
        }
        showLocationDetail(firstAddress);
        openRightPanel();
      }
    });
    //search list
    const suggestionsList = document.getElementById('suggestions-list') as HTMLSelectElement;
    function updateSuggestions(suggestions: any[]) {
        const searchText = searchInput.value.trim();
        suggestionsList.innerHTML = '';
        
        if (searchText === '') {
            suggestionsList.style.display = 'none';
            return;
        }            
        suggestions.forEach(function(suggestion) {
            const li = document.createElement('li');
            li.textContent = suggestion.properties.name;
            li.addEventListener('click', function() {
                const lngLat= suggestion.geometry.coordinates;
                marker.setLngLat(lngLat); 
                map.setCenter(lngLat);
                map.setZoom(18);
                showLocationDetail(suggestion);
                openRightPanel();
            });
            suggestionsList.appendChild(li);
        });
        
        suggestionsList.style.display = 'block';
    }
    
    searchInput.addEventListener('input', function() {
      const searchText = searchInput.value;
      const suggestions = data.features.filter(function(feature) {
          return feature.properties.name.toLowerCase().includes(searchText.toLowerCase());
      });
      
      updateSuggestions(suggestions);
    });

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
