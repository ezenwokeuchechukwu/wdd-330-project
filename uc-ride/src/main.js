import { renderHeader } from './src/components/header.js'; 
import { renderFooter } from './src/components/Footer.js';
import { renderRideForm } from './src/components/rideCard.js';
import { loadGoogleMap } from './src/components/map.js';
import { fetchRideData } from './src/components/rideData.js';

// ✅ Environment variables
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

// ✅ Toast Notification
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ✅ Loading Spinner
function showSpinner(show = true) {
  const spinner = document.getElementById('loadingSpinner');
  if (!spinner) return;
  spinner.classList.toggle('hidden', !show);
}

// ✅ Map & Booking Logic
let map;
let directionsService;
let directionsRenderer;

window.initMap = function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 9.0578, lng: 7.4951 }, // Abuja
    zoom: 12,
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  new google.maps.places.Autocomplete(document.getElementById("pickup"));
  new google.maps.places.Autocomplete(document.getElementById("dropoff"));
};

function processPayment(amount) {
  const handler = PaystackPop.setup({
    key: 'YOUR_PAYSTACK_PUBLIC_KEY',
    email: 'user@example.com',
    amount: amount * 100, // Paystack uses kobo
    currency: 'NGN',
    callback: function (response) {
      alert('Payment successful. Ref: ' + response.reference);
      document.getElementById("statusMessage").textContent = "Ride booked and paid!";
    },
    onClose: function () {
      alert('Payment cancelled.');
    },
  });
  handler.openIframe();
}

// ✅ Main Initialization

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderRideForm();
  renderFooter();
  loadGoogleMap(apiKey);
  fetchRideData(apiUrl);

  const toggle = document.getElementById('darkModeToggle');
  const rideBadge = document.getElementById('rideStatusBadge');
  const requestBtn = document.getElementById('requestRideBtn');

  if (toggle) {
    toggle.addEventListener('change', () => {
      document.body.classList.toggle('dark-mode', toggle.checked);
      showToast(toggle.checked ? 'Dark mode enabled' : 'Light mode enabled');
    });
  }

  if (requestBtn && rideBadge) {
    requestBtn.addEventListener('click', () => {
      const pickup = document.getElementById("pickup").value;
      const dropoff = document.getElementById("dropoff").value;

      if (!pickup || !dropoff) {
        showToast("Please enter both pickup and drop-off locations");
        return;
      }

      directionsService.route(
        {
          origin: pickup,
          destination: dropoff,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            directionsRenderer.setDirections(result);

            const distance = result.routes[0].legs[0].distance.value / 1000; // km
            const fare = Math.max(500, Math.round(distance * 100)); // ₦100/km, min ₦500

            document.getElementById("statusMessage").textContent = `Estimated Fare: ₦${fare}`;
            processPayment(fare);
          } else {
            alert("Could not find route. Check your input.");
          }
        }
      );
    });
  }

  // ✅ Auth logic
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const authModal = document.getElementById('authModal');
  const closeModal = document.getElementById('closeModal');
  const submitLogin = document.getElementById('submitLogin');
  const loginArea = document.getElementById('loginArea');
  const profileArea = document.getElementById('profileArea');
  const usernameDisplay = document.getElementById('usernameDisplay');

  loginBtn?.addEventListener('click', () => authModal.classList.remove('hidden'));
  closeModal?.addEventListener('click', () => authModal.classList.add('hidden'));

  submitLogin?.addEventListener('click', () => {
    const email = document.getElementById('email').value.trim();
    if (email) {
      const username = email.split('@')[0];
      usernameDisplay.textContent = `Welcome, ${username}`;
      profileArea.classList.remove('hidden');
      loginArea.classList.add('hidden');
      authModal.classList.add('hidden');
      showToast(`Logged in as ${username}`);
    }
  });

  logoutBtn?.addEventListener('click', () => {
    profileArea.classList.add('hidden');
    loginArea.classList.remove('hidden');
    usernameDisplay.textContent = 'Welcome, Guest';
    showToast('Logged out');
  });
});