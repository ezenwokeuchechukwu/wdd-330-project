// uc-ride/src/map.js

let map;
let directionsService;
let directionsRenderer;

export function loadGoogleMap() {
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 9.05785, lng: 7.49508 }, // Abuja default center
    zoom: 13,
  });

  directionsRenderer.setMap(map);
}

export async function geocodeAddress(address) {
  const geocoder = new google.maps.Geocoder();
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK" && results[0]) {
        resolve(results[0].geometry.location);
      } else {
        reject("Geocoding failed: " + status);
      }
    });
  });
}

export function drawRoute(start, end) {
  const request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  directionsService.route(request, (result, status) => {
    if (status === "OK") {
      directionsRenderer.setDirections(result);
    } else {
      console.error("Could not draw route:", status);
    }
  });
}
