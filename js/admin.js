/**
 * Admin dashboard logic
 * Displays localStorage, sessionStorage, derived user data, and GitHub Gist integration
 */

/**
 * Display derived user data
 */
function displayDerivedData() {
  // Current date/time
  const now = new Date();
  document.getElementById('currentDateTime').textContent = now.toLocaleString();
  
  // Browser info
  const browserInfo = navigator.userAgent;
  document.getElementById('browserInfo').textContent = browserInfo.substring(0, 50) + '...';
  
  // Platform info
  document.getElementById('platformInfo').textContent = navigator.platform;
  
  // Screen resolution
  document.getElementById('screenInfo').textContent = `${window.screen.width} x ${window.screen.height}`;
}

/**
 * Display localStorage data
 */
function displayLocalStorage() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    data[key] = localStorage.getItem(key);
  }
  document.getElementById('localStorageData').textContent = JSON.stringify(data, null, 2);
}

/**
 * Display sessionStorage data
 */
function displaySessionStorage() {
  const data = {};
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    data[key] = sessionStorage.getItem(key);
  }
  document.getElementById('sessionStorageData').textContent = JSON.stringify(data, null, 2);
}

/**
 * Display last saved fish
 */
function displayLastSavedFish() {
  const lastFish = sessionStorage.getItem('lastSavedFish');
  if (lastFish) {
    document.getElementById('lastSavedFish').textContent = JSON.stringify(JSON.parse(lastFish), null, 2);
  }
}

/**
 * Save fish data to GitHub Gist
 * Following gist-api-pat.md pattern
 */
async function saveToGist() {
  const token = document.getElementById('gistToken').value;
  const gistId = sessionStorage.getItem('gistId');
  const fishData = localStorage.getItem('fish');
  
  if (!token) {
    showGistMessage('Please enter a GitHub Personal Access Token', 'danger');
    return;
  }
  
  if (!fishData) {
    showGistMessage('No fish data to save', 'warning');
    return;
  }
  
  try {
    let gist;
    
    if (gistId) {
      // Update existing gist
      const response = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: 'Charlie Fish Tracker Data',
          files: {
            'fish-data.json': {
              content: fishData
            }
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update gist');
      }
      
      gist = await response.json();
    } else {
      // Create new gist
      const response = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: 'Charlie Fish Tracker Data',
          public: false,
          files: {
            'fish-data.json': {
              content: fishData
            }
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create gist');
      }
      
      gist = await response.json();
      
      // Save gist ID and URL to sessionStorage
      sessionStorage.setItem('gistId', gist.id);
      sessionStorage.setItem('gistUrl', gist.html_url);
      document.getElementById('gistUrl').value = gist.html_url;
    }
    
    showGistMessage(`Data saved to Gist! <a href="${gist.html_url}" target="_blank">View Gist</a>`, 'success');
    console.log('Saved to gist:', gist.html_url);
    
  } catch (error) {
    console.error('Error saving to gist:', error);
    showGistMessage('Error saving to Gist. Check your token and try again.', 'danger');
  }
}

/**
 * Load fish data from GitHub Gist
 * Following gist-api-pat.md pattern
 */
async function loadFromGist() {
  const token = document.getElementById('gistToken').value;
  const gistId = sessionStorage.getItem('gistId');
  
  if (!token) {
    showGistMessage('Please enter a GitHub Personal Access Token', 'danger');
    return;
  }
  
  if (!gistId) {
    showGistMessage('No Gist ID found. Please save data first.', 'warning');
    return;
  }
  
  try {
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch gist');
    }
    
    const gist = await response.json();
    const fishData = gist.files['fish-data.json']?.content;
    
    if (fishData) {
      localStorage.setItem('fish', fishData);
      showGistMessage('Data loaded from Gist successfully!', 'success');
      console.log('Loaded from gist');
      
      // Refresh localStorage display
      displayLocalStorage();
    } else {
      showGistMessage('No fish-data.json found in gist', 'warning');
    }
    
  } catch (error) {
    console.error('Error loading from gist:', error);
    showGistMessage('Error loading from Gist. Check your token and Gist ID.', 'danger');
  }
}

/**
 * Show gist message
 */
function showGistMessage(message, type) {
  const messageDiv = document.getElementById('gistMessage');
  messageDiv.className = `alert alert-${type}`;
  messageDiv.innerHTML = message;
  messageDiv.style.display = 'block';
  
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 5000);
}

/**
 * Clear all data
 */
async function clearAllData() {
  const confirmed = await showConfirmModal('Are you sure you want to clear all data? This cannot be undone.', 'Clear All Data');
  
  if (confirmed) {
    localStorage.clear();
    sessionStorage.clear();
    
    displayLocalStorage();
    displaySessionStorage();
    displayLastSavedFish();
    
    document.getElementById('gistUrl').value = '';
    
    showGistMessage('All data cleared', 'success');
    console.log('All data cleared');
  }
}

/**
 * Initialize admin dashboard
 */
function initAdmin() {
  // Require authentication
  requireAuth();
  
  displayDerivedData();
  displayLocalStorage();
  displaySessionStorage();
  displayLastSavedFish();
  
  // Load saved gist URL
  const savedGistUrl = sessionStorage.getItem('gistUrl');
  if (savedGistUrl) {
    document.getElementById('gistUrl').value = savedGistUrl;
  }
  
  // Update time every second
  setInterval(displayDerivedData, 1000);
  
  // Event listeners
  document.getElementById('saveToGist').addEventListener('click', saveToGist);
  document.getElementById('loadFromGist').addEventListener('click', loadFromGist);
  document.getElementById('clearAllData').addEventListener('click', clearAllData);
}

// Run on page load
document.addEventListener('DOMContentLoaded', initAdmin);
