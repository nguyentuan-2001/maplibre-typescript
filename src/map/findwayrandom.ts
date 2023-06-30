import { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import PathFinder from "geojson-path-finder";
import { point } from "@turf/helpers";
import * as geolib from 'geolib';
const roads = require('../geojson/road.geojson');

export function findrandom(map: Map){
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
                drawPath(start, end, map);
            }
        });
    });
}

function drawPath(startp: number[], endp: number[], map: Map) {
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