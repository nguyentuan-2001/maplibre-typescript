import maplibregl from 'maplibre-gl';

export const createMap = () => {
  const west: number = 109.223122; // Tọa độ tây
  const east: number = 109.266014; // Tọa độ đông
  const north: number = 12.234198; // Tọa độ bắc
  const south: number = 12.209492; // Tọa độ nam

  const bounds: maplibregl.LngLatBoundsLike = [
    [west, south],
    [east, north],
  ];

  const map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=S1qTEATai9KydkenOF6W',
    center: [109.240512, 12.218791],
    zoom: 16,
    hash: 'map',
    bounds: bounds,
    maxBounds: bounds,
  });

  return map;
};
