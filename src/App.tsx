import React, { useEffect } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import Navbar from './components/navbar';
import data from './geojson/data.json';
import { createMap } from './map/mapnew';
import overMap from './map/topographic';
import { markerImage, zoom } from './map/markerimage';
import { closeRightPanel } from './map/showinformation';
import { search, updateSuggestions } from './map/search';
import { findway } from './map/findway';
import { findrandom } from './map/findwayrandom';


const App: React.FC = () => {
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
    
    // find the way
    findway(map);
    
    //search street random
    findrandom(map);
  
    //delete map if component cancel
    return () => map.remove();
  }, []);

  return (
    <div className="map-wrap" >
      <Navbar/>
    </div>
  );
};

export default App;
