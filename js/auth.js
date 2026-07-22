/**
 * Shared authentication utilities
 * Handles JWT token-based authentication across the app
 */

/**
 * Check if user is logged in via token presence
 * @returns {boolean} True if authenticated
 */
function isLoggedIn() {
  return Boolean(sessionStorage.getItem('authToken'));
}

/**
 * Get the current authentication token
 * @returns {string|null} The JWT token or null
 */
function getAuthToken() {
  return sessionStorage.getItem('authToken');
}

/**
 * Get the current username
 * @returns {string|null} The username or null
 */
function getUsername() {
  return sessionStorage.getItem('username');
}

/**
 * Redirect to login page if not authenticated
 */
function requireAuth() {
  if (!isLoggedIn()) {
    // Don't redirect if already on auth page
    if (!window.location.pathname.includes('auth.html')) {
      console.log('User not authenticated, redirecting to login');
      // If in pages directory, go to auth.html directly
      // If in root, go to pages/auth.html
      if (window.location.pathname.includes('/pages/')) {
        window.location.href = 'auth.html';
      } else {
        window.location.href = 'pages/auth.html';
      }
    }
  }
}

/**
 * Logout user by clearing session storage
 */
function logout() {
  console.log('Logging out user');
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('sessionAuthN');
  sessionStorage.removeItem('username');
  window.location.href = 'index.html';
}

/**
 * Update UI based on authentication state
 * @param {string} elementId - ID of the element to update
 */
function updateAuthUI(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const username = getUsername();
  
  if (isLoggedIn() && username) {
    element.innerHTML = `<i class="bi bi-person-circle me-1"></i>Hello, ${username}`;
  } else {
    element.innerHTML = `<i class="bi bi-person-circle me-1"></i>Please Login`;
  }
}
