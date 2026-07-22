/**
 * Index page authentication logic
 * Checks session storage and updates UI accordingly
 */

function checkAuthState() {
  const username = getUsername();
  const loginState = document.getElementById('loginState');
  const loginLogoutLink = document.getElementById('loginLogoutLink');
  
  console.log('Auth state:', isLoggedIn());
  
  if (isLoggedIn() && username) {
    loginState.innerHTML = `<i class="bi bi-person-circle me-1"></i>Hello, ${username}`;
    loginLogoutLink.innerHTML = `<i class="bi bi-box-arrow-right me-1"></i>Logout`;
    loginLogoutLink.onclick = (e) => {
      e.preventDefault();
      logout();
    };
  } else {
    loginState.innerHTML = `<i class="bi bi-person-circle me-1"></i>Please Login`;
    loginLogoutLink.innerHTML = `<i class="bi bi-box-arrow-in-right me-1"></i>Login`;
    loginLogoutLink.onclick = null;
  }
}

/**
 * Display gist link in footer if available
 */
function displayGistLink() {
  const gistUrl = sessionStorage.getItem('gistUrl');
  const gistLinkFooter = document.getElementById('gistLinkFooter');
  
  if (gistUrl) {
    gistLinkFooter.innerHTML = `<a href="${gistUrl}" target="_blank" class="text-white text-decoration-none">View Saved Gist</a>`;
  } else {
    gistLinkFooter.textContent = 'No Gist saved';
  }
}

/**
 * Load app data from JSON file
 */
async function loadAppData() {
  try {
    const response = await fetch('data/charlie-data.json');
    
    if (!response.ok) {
      throw new Error('Failed to load app data: ' + response.status);
    }
    
    const data = await response.json();
    console.log('App data loaded:', data);
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid data format: expected an array');
    }
    
    renderAppData(data[0]);
  } catch (error) {
    console.error('Error loading app data:', error);
    showError('Failed to load app data. Using fallback content.');
    renderFallbackContent();
  }
}

/**
 * Render app data from JSON
 */
function renderAppData(appData) {
  // Update title and tagline
  const appTitle = document.getElementById('appTitle');
  const appTagline = document.getElementById('appTagline');
  
  if (appTitle && appData.title) {
    appTitle.textContent = appData.title;
  }
  if (appTagline && appData.tagline) {
    appTagline.textContent = appData.tagline;
  }
  
  // Render cards based on links
  const cardsContainer = document.getElementById('cardsContainer');
  if (!cardsContainer) return;
  
  cardsContainer.innerHTML = '';
  
  // Create navigation cards based on app structure
  const navCards = [
    {
      icon: 'bi-plus-circle',
      color: 'text-primary',
      title: 'Add a Catch',
      text: 'Log your latest fishing catch with all the details',
      link: 'pages/add-catch.html',
      btnText: 'Add Catch',
      btnIcon: 'bi-plus-lg',
      btnClass: 'btn-primary'
    },
    {
      icon: 'bi-journal-text',
      color: 'text-success',
      title: 'View All Catches',
      text: 'Browse your complete fishing history',
      link: 'pages/catches.html',
      btnText: 'View Catches',
      btnIcon: 'bi-eye',
      btnClass: 'btn-success'
    }
  ];
  
  navCards.forEach(card => {
    const cardCol = document.createElement('div');
    cardCol.className = 'col-md-6 mb-4';
    
    cardCol.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <i class="bi ${card.icon} display-4 ${card.color} mb-3"></i>
          <h3 class="card-title">${card.title}</h3>
          <p class="card-text">${card.text}</p>
          <a href="${card.link}" class="btn ${card.btnClass}">
            <i class="bi ${card.btnIcon} me-1"></i>${card.btnText}
          </a>
        </div>
      </div>
    `;
    
    cardsContainer.appendChild(cardCol);
  });
  
  // Store app data in sessionStorage for other pages
  sessionStorage.setItem('appData', JSON.stringify(appData));
}

/**
 * Show error message
 */
function showError(message) {
  const cardsContainer = document.getElementById('cardsContainer');
  if (cardsContainer) {
    cardsContainer.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning" role="alert">
          <i class="bi bi-exclamation-triangle me-2"></i>${message}
        </div>
      </div>
    `;
  }
}

/**
 * Render fallback content if JSON fails to load
 */
function renderFallbackContent() {
  const cardsContainer = document.getElementById('cardsContainer');
  if (!cardsContainer) return;
  
  cardsContainer.innerHTML = `
    <div class="col-md-6 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <i class="bi bi-plus-circle display-4 text-primary mb-3"></i>
          <h3 class="card-title">Add a Catch</h3>
          <p class="card-text">Log your latest fishing catch with all the details</p>
          <a href="pages/add-catch.html" class="btn btn-primary">
            <i class="bi bi-plus-lg me-1"></i>Add Catch
          </a>
        </div>
      </div>
    </div>
    <div class="col-md-6 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <i class="bi bi-journal-text display-4 text-success mb-3"></i>
          <h3 class="card-title">View All Catches</h3>
          <p class="card-text">Browse your complete fishing history</p>
          <a href="pages/catches.html" class="btn btn-success">
            <i class="bi bi-eye me-1"></i>View Catches
          </a>
        </div>
      </div>
    </div>
  `;
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuthState();
  displayGistLink();
  loadAppData();
});
