export function renderRideForm() {
  const container = document.createElement('div');
  container.className = 'ride-overlay';

  container.innerHTML = `
    <div class="form-box">
      <input type="text" id="pickup" placeholder="Pickup Location" />
      <input type="text" id="dropoff" placeholder="Dropoff Location" />
      <button id="requestRideBtn">Request Ride</button>
    </div>
  `;

  document.body.appendChild(container);
}
