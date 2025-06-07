import { renderHeader } from './src/components/header.js';
import { renderFooter } from './src/components/Footer.js';
import { renderRideForm } from './src/components/rideCard.js';
import { loadGoogleMap } from './src/components/map.js';
import { fetchRideData } from './src/components/rideData.js';

// ✅ Environment variables
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

// ✅ Single event listener to initialize everything
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();         // Builds <header>
  renderRideForm();       // Builds map, pickup/dropoff inputs, button
  renderFooter();         // Builds <footer>
  loadGoogleMap(apiKey);  // Loads Google Maps + autocomplete + click handler
  fetchRideData(apiUrl);  // Fetches ride data from backend
});
