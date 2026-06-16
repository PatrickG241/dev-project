# 🎣 Fish Tracker

*Track your fishing adventures with ease*

---

## 📖 User Story

As a angler, I want to easily log and track my catches including details like fish type, size, weight, location, and conditions so I can review my fishing history and share my experiences with others.

---

## 🛠 Tech Stack

- **HTML5** - Structure and markup
- **CSS3** - Styling with fishing-themed design
- **Bootstrap 5.3** - Responsive UI framework via CDN
- **Vanilla JavaScript** - Logic and localStorage persistence
- **localStorage API** - Client-side data storage

---

## 📁 Directory Structure

```
dev-project/
├── css/
│   ├── index.css          # Hub page styling
│   ├── add-catch.css      # Add catch form styling
│   └── catches.css        # Catches list styling
├── js/
│   ├── index.js           # Hub page authentication logic
│   ├── add-catch.js       # Form submission & validation
│   └── catches.js         # Render & manage catches
├── pages/
│   ├── auth.html          # Login/logout page
│   ├── add-catch.html     # Add new catch form
│   └── catches.html       # View all catches
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

---

## 👤 Authorship & Attribution

### Resources
- **Background Image**: Custom fish pattern (fishbackground.jpg)

### AI Prompts
This project was developed with assistance from Cascade AI for:
- CSS styling and fishing-themed design
- Creating this readme to recap all that was created