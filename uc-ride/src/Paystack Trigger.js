function showPaystackButton(amount) {
  const handler = PaystackPop.setup({
    key: 'YOUR_PUBLIC_KEY',
    email: 'user@example.com',
    amount: amount * 100, // in kobo
    currency: "NGN",
    callback: function(response) {
      alert('Payment complete! Reference: ' + response.reference);
      document.getElementById("statusMessage").textContent = "Ride Booked & Paid.";
    },
    onClose: function() {
      alert('Transaction cancelled.');
    }
  });
  handler.openIframe();
}
