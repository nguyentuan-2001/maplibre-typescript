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
import { showLocationDetail } from './showinformation';


export function search(map: Map, marker: Marker){
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
        }
    });
}


export function updateSuggestions(suggestions: any[], map: Map, marker: Marker) {
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const suggestionsList = document.getElementById('suggestions-list') as HTMLSelectElement;
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
        });
        suggestionsList.appendChild(li);
    });
    
    suggestionsList.style.display = 'block';
}


