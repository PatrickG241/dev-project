/**
 * Add catch form logic
 * Handles form submission, validation, and localStorage persistence
 */

// Set default date and time on page load
document.addEventListener('DOMContentLoaded', () => {
  // Require authentication
  requireAuth();
  
  document.getElementById('fishDate').valueAsDate = new Date();
  console.log('Default date set');

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('fishTime').value = `${hours}:${minutes}`;
  console.log('Default time set');
});

document.getElementById('fishForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  try {
    const type = document.getElementById('fishType').value;
    const length = document.getElementById('fishLength').value;
    const weight = document.getElementById('fishWeight').value;
    const water = document.getElementById('fishWater').value;
    const temp = document.getElementById('fishTemp').value;
    const time = document.getElementById('fishTime').value;
    const date = document.getElementById('fishDate').value;
    
    console.log('Form submitted:', { type, length, weight, water, temp, time, date });
    
    // Create fish object
    const newFish = {
      type,
      length: length || null,
      weight: weight || null,
      water: water || null,
      temp: temp || null,
      time: time || null,
      date,
      favorite: false,
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    let fish = JSON.parse(localStorage.getItem('fish')) || [];
    fish.push(newFish);
    localStorage.setItem('fish', JSON.stringify(fish));
    console.log('Fish saved to localStorage');
    
    // Save to sessionStorage for admin page
    sessionStorage.setItem('lastSavedFish', JSON.stringify(newFish));
    
    // Show success message
    const messageDiv = document.getElementById('message');
    messageDiv.className = 'alert alert-success';
    messageDiv.textContent = 'Catch added successfully!';
    messageDiv.style.display = 'block';
    
    // Show view catches link
    document.getElementById('viewCatchesLink').style.display = 'block';
    
    // Reset form and restore defaults
    e.target.reset();
    document.getElementById('fishDate').valueAsDate = new Date();
    
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('fishTime').value = `${hours}:${minutes}`;
    console.log('Form reset, defaults restored');
    
  } catch (error) {
    console.error('Error saving fish:', error);
    const messageDiv = document.getElementById('message');
    messageDiv.className = 'alert alert-danger';
    messageDiv.textContent = 'Error saving catch. Please try again.';
    messageDiv.style.display = 'block';
  }
});
