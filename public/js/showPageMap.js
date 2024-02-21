mapboxgl.accessToken = mapToken;
const coordinates = JSON.parse(spot).geometry.coordinates;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const marker1 = new mapboxgl.Marker()
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${JSON.parse(spot).title}</h4><p>${JSON.parse(spot).location}</p>`
    )
  )
  .addTo(map);
