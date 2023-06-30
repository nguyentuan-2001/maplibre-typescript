import { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import PathFinder from "geojson-path-finder";
import { point } from "@turf/helpers";
import data from '../geojson/data.json';
const roads = require('../geojson/road.geojson');

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

export function findway(map: Map){
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
    findPath(startPoint,endPoint,map);

});
}

function findPath(startPoint: number[], endPoint: number[], map: Map) {
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