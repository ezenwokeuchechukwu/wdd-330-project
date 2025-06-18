export function renderHeader() {
  const header = document.createElement('header');
  header.className = 'main-header';

  header.innerHTML = `
    <div class="logo">UC Ride</div>
    <nav class="nav-links">
      <button id="signinBtn">Sign In</button>
      <button id="accountBtn">My Account</button>
    </nav>
  `;

  document.body.prepend(header);

  // Example: Alert placeholders (replace with modal or auth logic)
  document.getElementById('signinBtn').addEventListener('click', () => {
    alert('🔐 Sign In button clicked. Implement auth here.');
  });

  document.getElementById('accountBtn').addEventListener('click', () => {
    alert('👤 Account section clicked. Load user dashboard or profile.');
  });
}
