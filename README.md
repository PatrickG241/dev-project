# 🎣 Charlie Fish Tracker

> *Track your fishing adventures with ease*

---

## 📖 User Story

As an angler, I want to easily log and track my catches including details like fish type, size, weight, location, and conditions so I can review my fishing history and share my experiences with others.

---

## 📝 Narrative

I love fishing but often forget the details of my best catches. I want a simple app to record where I caught fish, what conditions were like, and track my progress over time. This app helps me build a fishing journal that I can reference and share with fellow anglers. The Charlie refactor adds modern authentication, JSON-driven architecture, and cloud data persistence.

---

## 👤 Authorship

- **Author**: Patrick Graham
- **GitHub Profile**: [PatrickG241](https://github.com/PatrickG241)
- **Version**: 2.0.0 (Charlie Refactor)
- **Date**: July 2026
- **ALFA Version**: [alfa branch](https://github.com/PatrickG241/dev-project/tree/alfa)

---

## 🛠 Resources

### Technologies & Libraries
- **HTML5** - Structure and markup
- **CSS3** - Styling with Bootstrap 5 and Roboto font
- **Bootstrap 5.3** - Responsive UI framework via CDN
- **Vanilla JavaScript** - Logic and data persistence
- **Google Fonts** - Typography (Roboto)
- **Bootstrap Icons** - Iconography via CDN
- **jQuery** - DOM manipulation and event handling
- **jQuery UI** - Enhanced UI interactions
- **Normalize.css** - CSS reset for cross-browser consistency

### Development Tools
- **LiveServer** - Local development server with hot reload
- **GitHub** - Version control, repository hosting, GitHub Pages
- **GitHub Gist API** - Data persistence and sharing
- **Fetch API** - Modern HTTP requests for JSON data
- **Markdown** - Documentation formatting

---

## 💻 Code Snippets

### HTML/DOM: Navigation Card
```html
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
```

### JavaScript: Fetch API for JSON Data Loading
```javascript
async function loadAppData() {
  try {
    const response = await fetch('data/charlie-data.json');
    if (!response.ok) {
      throw new Error('Failed to load app data: ' + response.status);
    }
    const data = await response.json();
    renderAppData(data[0]);
  } catch (error) {
    console.error('Error loading app data:', error);
    renderFallbackContent();
  }
}
```

### JavaScript: JWT Authentication with Fallback
```javascript
async function authenticateWithAPI(password) {
  try {
    const response = await fetch(`${API_BASE}/api/authn/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (!response.ok) throw new Error('API auth failed');
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.log('API unavailable, using fallback');
    return null;
  }
}

function fallbackAuth(password) {
  return password === 'cat';
}
```

### JavaScript: GitHub Gist API Save
```javascript
async function saveToGist() {
  const token = document.getElementById('gistToken').value;
  const gistId = sessionStorage.getItem('gistId');
  const fishData = localStorage.getItem('fish');
  
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
        files: { 'fish-data.json': { content: fishData } }
      })
    });
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
        files: { 'fish-data.json': { content: fishData } }
      })
    });
  }
}
```

---

## 📁 Directory Structure

```
charlie-fish-tracker/
├── css/
│   ├── index.css          # Hub page styling
│   ├── add-catch.css      # Add catch form styling
│   ├── catches.css        # Catches list styling
│   └── admin.css          # Admin page styling
├── js/
│   ├── index.js           # Hub page logic & JSON loading
│   ├── auth.js            # Shared authentication utilities
│   ├── modals.js          # Bootstrap modal utilities
│   ├── add-catch.js       # Form submission & validation
│   ├── catches.js         # Render, search, filter, sort catches
│   └── admin.js           # Admin page data display & Gist API
├── pages/
│   ├── auth.html          # Login/logout page
│   ├── add-catch.html     # Add new catch form
│   ├── catches.html       # View all catches with search/filter
│   └── admin.html         # Admin dashboard
├── data/
│   └── charlie-data.json  # App metadata and configuration
├── fishbackground.jpg     # Repeating fish pattern background
├── index.html             # Main hub/navigation page
└── README.md              # This file
```

---

## ✅ Validations & Accessibility

### Form Validations
- **Required fields**: Fish type and date are mandatory
- **Optional fields**: Length, weight, body of water, temperature, time
- **Data types**: Number inputs for length and temperature
- **Default values**: Date defaults to today, time defaults to current time

### Accessibility Features
- Semantic HTML structure
- Clear form labels with placeholder text
- Keyboard navigable forms
- Responsive design with centered layouts
- High contrast text on backgrounds
- Readable font sizes (16px+ for inputs)
- ARIA labels for screen readers

---

## 🚀 Charlie Refactor Features

### Authentication
- JWT Authentication API integration with fetch
- Fallback authentication using password "cat"
- Session-based auth with token storage
- Protected routes with `requireAuth()` checks
- Dynamic login/logout UI updates
- Bootstrap modal confirmations for destructive actions

### JSON-Driven Architecture
- Fetch API for loading app configuration from JSON
- Flexible data structure with user stories, links, notes
- Dynamic DOM rendering from JSON data
- Fallback content for error handling
- SessionStorage for app metadata

### Search, Filter, Sort & Favorites
- Real-time search across all catch data
- Filter by fish type with dynamic dropdown
- Sort by date (newest/oldest)
- Favorites/like feature with visual highlighting
- Favorites view to show liked catches at top

### GitHub Gist Integration
- Create new Gists for data persistence
- Update existing Gists on subsequent saves
- Load data from Gist to restore catches
- Personal Access Token authentication
- Gist link display in app footer

### Admin Dashboard
- localStorage inspection with formatted display
- sessionStorage inspection showing auth tokens and app data
- Derived user data: date/time, browser info, platform, screen resolution
- Gist management with save/load functionality
- Data clearing with confirmation modal

---

## 🔐 Authentication

### Login Credentials
- **Username**: Any username (for display purposes)
- **Password**: `cat` (fallback when API unavailable)