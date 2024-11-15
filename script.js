// domain restricted token https://salty-poc.webflow.io/
export const mapboxToken =
  "sk.eyJ1IjoiZmVsaXhoZWxsc3Ryb20iLCJhIjoiY20zajVjaGFpMDhkZzJzcHloZnh6bGR0diJ9.9dlnWnUwur23yCSsBuoqtw";

mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/felixhellstrom/cm3ixtwhi00f401ry5n0f3fjw",
  projection: "globe",
  zoom: 9,
  center: [-122.27170723084882, 37.740222543717096],
});

// List of station IDs
const stationIds = [
  "9410170", // San Diego, CA
  "9410230", // La Jolla, CA
  "9410660", // Los Angeles, CA
  "9410840", // Santa Monica, CA
  "9411340", // Santa Barbara, CA
  "9412110", // Port San Luis, CA
  "9413450", // Monterey, CA
  "9414290", // San Francisco, CA
  "9414523", // Redwood City, CA
  "9414750", // Alameda, CA
  "9414863", // Richmond, CA
  "9415020", // Point Reyes, CA
  "9415102", // Martinez-Amorco Pier, CA
  "9415144", // Port Chicago, CA
  "9416841", // Arena Cove, CA
  "9418767", // North Spit, CA
  "9419750", // Crescent City, CA
];

// Function to fetch data for a single station
function fetchStationData(stationId) {
  const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=latest&station=${stationId}&product=air_temperature&datum=STND&time_zone=lst&units=english&format=json`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let temperature = data.data[0].v;
      let name = data.metadata.name;
      let coordinates = [data.metadata.lon, data.metadata.lat];

      createMarker(coordinates, name);
      console.log("Temperature: " + temperature + " farenheit");
      console.log("Station Name: " + name);
      console.log("Coordinates: " + coordinates);
    })
    .catch((error) => {
      console.error(`Error fetching data for station ${stationId}:`, error);
    });
}

function createMarker(coordinates, popupText) {
  let beachPopupX = new mapboxgl.Popup({ offset: 25 }).setText(popupText);

  let markerElementX = document.createElement("div");
  markerElementX.className = "beach-marker";

  new mapboxgl.Marker(markerElementX)
    .setLngLat(coordinates)
    .setPopup(beachPopupX)
    .addTo(map);
}

// Fetch data for all stations
stationIds.forEach((stationId) => {
  fetchStationData(stationId);
});

// Get the map's center coordinates
function getMapCenter() {
  const center = map.getCenter();
  console.log(`Map center: ${center.lng}, ${center.lat}`);
}

// Log center whenever map moves
map.on("moveend", () => {
  getMapCenter();
});

// Log current coordinates to console on mouse click
map.on("click", (e) => {
  console.log(`${e.lngLat.lng}, ${e.lngLat.lat}`);
});
