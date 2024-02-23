mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: JSON.parse(coordinates), // starting position [lng, lat]
  zoom: 9, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());
const marker1 = new mapboxgl.Marker()
  .setLngLat(JSON.parse(coordinates))
  .addTo(map);
