import { loadGoogleMap, geocodeAddress, drawRoute } from './map.js';
import { triggerPaystackPayment } from './Paystack Trigger.js';

const pickupInput = document.getElementById('pickup');
const dropoffInput = document.getElementById('dropoff');
const requestBtn = document.getElementById('requestRideBtn');
const statusMessage = document.getElementById('statusMessage');
const rideHistoryList = document.getElementById('rideHistoryList');

let rideHistory = JSON.parse(localStorage.getItem('rideHistory')) || [];

const drivers = [
  { id: 1, name: 'Blessing', rating: 4.8, vehicle: 'Toyota', plate: 'ABJ123', available: true, location: { lat: 9.06, lng: 7.49 }, experience: '3y', language: 'Eng' },
  { id: 2, name: 'Samuel', rating: 4.9, vehicle: 'Honda', plate: 'ABJ456', available: true, location: { lat: 9.06, lng: 7.50 }, experience: '2y', language: 'Hausa' },
  { id: 3, name: 'Amina', rating: 4.7, vehicle: 'Kia', plate: 'ABJ789', available: true, location: { lat: 9.059, lng: 7.498 }, experience: '4y', language: 'Igbo' },
  // add more to reach 8+ attributes
];

function renderRideHistory() {
  rideHistoryList.innerHTML = '';
  rideHistory.forEach(r => {
    const li = document.createElement('li');
    li.textContent = `${r.pickup} → ${r.dropoff} on ${r.date} ✭ Fare: ₦${r.price}`;
    rideHistoryList.appendChild(li);
  });
}

function saveToLocalStorage() {
  localStorage.setItem('rideHistory', JSON.stringify(rideHistory));
  localStorage.setItem('lastPickup', pickupInput.value);
  localStorage.setItem('lastDropoff', dropoffInput.value);
}

async function handleRideRequest() {
  const pickup = pickupInput.value, dropoff = dropoffInput.value;
  if (!pickup || !dropoff) {
    statusMessage.textContent = 'Enter both pickup and dropoff.';
    return;
  }
  try {
    const pC = await geocodeAddress(pickup);
    const dC = await geocodeAddress(dropoff);
    drawRoute(pC, dC);

    const driver = drivers[Math.floor(Math.random() * drivers.length)];
    const price = (Math.random() * (2000 - 800) + 800).toFixed(0);

    statusMessage.textContent = `Driver ${driver.name} (${driver.vehicle}) en route. Fare: ₦${price}`;

    triggerPaystackPayment('user@example.com', price, () => console.log('Paid!'));

    const ride = { pickup, dropoff, driver: driver.name, price, date: new Date().toLocaleString() };
    rideHistory.push(ride);
    saveToLocalStorage();
    renderRideHistory();
  } catch (e) {
    statusMessage.textContent = 'Error finding route.';
    console.error(e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  pickupInput.value = localStorage.getItem('lastPickup') || '';
  dropoffInput.value = localStorage.getItem('lastDropoff') || '';
  loadGoogleMap();
  renderRideHistory();
});

requestBtn.addEventListener('click', handleRideRequest);
