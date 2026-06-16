
document.getElementById('fishDate').valueAsDate = new Date();
console.log('Default date set');

const now = new Date();
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
document.getElementById('fishTime').value = `${hours}:${minutes}`;
console.log('Default time set');

document.getElementById('fishForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const type = document.getElementById('fishType').value;
  const length = document.getElementById('fishLength').value;
  const weight = document.getElementById('fishWeight').value;
  const water = document.getElementById('fishWater').value;
  const temp = document.getElementById('fishTemp').value;
  const time = document.getElementById('fishTime').value;
  const date = document.getElementById('fishDate').value;
  
  console.log('Form submitted:', { type, length, weight, water, temp, time, date });
  
  let fish = JSON.parse(localStorage.getItem('fish')) || [];
  fish.push({ type, length, weight, water, temp, time, date });
  localStorage.setItem('fish', JSON.stringify(fish));
  console.log('Fish saved to localStorage');
  
  document.getElementById('message').textContent = 'Catch added!';
  document.getElementById('viewCatchesLink').style.display = 'block';
  e.target.reset();
  document.getElementById('fishDate').valueAsDate = new Date();

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('fishTime').value = `${hours}:${minutes}`;
  console.log('Form reset, defaults restored');
});
