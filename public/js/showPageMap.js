mapboxgl.accessToken = mapToken;

function escapeNewLinesAndCarriageReturns(jsonString) {
  return jsonString.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}

const spotFormatted = escapeNewLinesAndCarriageReturns(spot);

const coordinates = JSON.parse(spotFormatted).geometry.coordinates;
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
      `<h4>${JSON.parse(spotFormatted).title}</h4><p>${
        JSON.parse(spotFormatted).location
      }</p>`
    )
  )
  .addTo(map);
