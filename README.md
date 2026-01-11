# 🍙 AniManga - Ultimate Discovery Platform

<img width="1919" height="1058" alt="AniManga Dashboard" src="https://github.com/user-attachments/assets/a92ff77c-a73e-4f22-aefe-54ab09055f76" />

> A modern, responsive, and feature-rich anime & manga discovery web application powered by the **Jikan API (MyAnimeList)**. Built with React and Tailwind CSS.

---

## 🔗 **Live Demo**
### 🚀 **[Click here to view the Live Site](https://https-github-com-xicoldes-anime-api.onrender.com/)**

---

## 🚀 Key Features

### **1. 🏠 Immersive Home Experience**
* **Cinematic Spotlight:** A "Frieren-style" auto-sliding hero section with high-quality visuals, English titles, and a clean interface (no dark overlays).
    * *Mobile Optimized:* Features a vertical gradient for readability and touch-friendly navigation.
* **True Trending Sidebar:** Displays the **Top 11-20** currently airing shows to complement the spotlight without duplicates.
* **Smart Filtering:** Sort content by **Genre**, **Popularity**, or **Score**.
* **Latest Episodes:** Real-time updates for currently airing series.

### **2. 📚 Manga Database**
* **Extensive Library:** Browse thousands of manga titles with advanced deduplication.
* **Read Now Integration:** Smart buttons that dynamically link to reading sources (e.g., MangaKatana) based on the title.
* **Pagination:** Smooth navigation for large collections.

### **3. 🔍 Smart Search**
* **Context-Aware:** Automatically detects if you are searching for **Anime** or **Manga** based on your active page.
* **Live Results:** Instant dropdown feedback as you type.
* **Deep Linking:** Shareable search URLs (e.g., `/search?q=jujutsu`).

### **4. 📄 Rich Detail Pages**
* **Wiki Layout:** A classic 3-column design displaying metadata (Score, Rank, Popularity), synopsis, and background info.
* **Trailer Integration:** Watch official trailers directly on the page.
* **Character Grid:** Visual cast lists with roles (Main/Supporting).
* **Author Search:** Quick links to find manga authors on Google/Wiki.

### **5. ❤️ User Collections (Watchlist)**
* **Horizontal Scroll UI:** A Netflix-style horizontal list for your saved Anime and Manga.
* **Jump Controls:** New `<<` and `>>` buttons to instantly jump to the start or end of your collection.
* **Local Storage Auth:** Persistent bookmarking system that remembers your list without requiring a backend.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite)
* **Styling:** Tailwind CSS
* **API:** Jikan API v4 (Unofficial MyAnimeList API)
* **Routing:** React Router DOM
* **Icons:** React Icons (FontAwesome/Feather)
* **Deployment:** Render

---

## 📦 Installation & Setup

1. **Clone the repository**
```bash
   git clone https://github.com/xicoldes/anime-api.git
   cd anime-api
```
### **2. Install Frontend Dependencies**

Navigate to the client folder where the React app lives:
```bash
cd client

npm install
```
### **3. Start the Development Server**
```bash
npm run dev
```
The app will launch at http://localhost:5173.


## 📂 Project Structure
```bash
ANIME-API/
├── client/                   # Frontend React Application
│   ├── src/
│   │   ├── assets/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Hero.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Trending.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── AnimeDetails.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Manga.jsx
│   │   │   ├── MangaDetails.jsx
│   │   │   ├── Movies.jsx
│   │   │   ├── Search.jsx
│   │   │   └── Watchlist.jsx
│   │   ├── services/         # API handling
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.jsx           # Main Frontend Route Setup
│   │   ├── index.css         # Global Styles (Tailwind)
│   │   └── main.jsx          # React Entry Point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── controllers/              # Backend Logic
│   └── animeController.js
├── routes/                   # Backend Routes
│   └── animeRoutes.js
├── app.js                    # Backend Entry Point
├── package.json              # Root Dependencies
└── README.md                 # Project Documentation
```


## 🚀 Deployment (Render)
This project is optimized for deployment on Render.

1. New Static Site: Connect your GitHub repo.

2. Root Directory: client

3. Build Command: npm install; npm run build

4. Publish Directory: dist

Note: If you encounter a "Route not found" error on refresh, you may need to add a rewrite rule in Render settings (Source: /* -> Destination: /index.html).


## ⚠️ Disclaimer
This project uses the free Jikan API.

- Rate Limits: You may experience a 429 error if you refresh too rapidly. This is a limitation of the free API tier.

- Data: All data is provided by MyAnimeList via Jikan.


## 📝 License
This project is for educational purposes.
