mapboxgl.accessToken = mapToken;
const coordinates = JSON.parse(spot).geometry.coordinates;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const marker1 = new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
