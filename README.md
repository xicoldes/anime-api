# 🍙 AniManga - Anime + Manga Discovery Platform

<img width="1919" height="1053" alt="image" src="https://github.com/user-attachments/assets/af9c488d-ec3b-4655-9c09-f4468824b785" />

> A modern, responsive, and feature-rich anime & manga discovery web application powered by the **Jikan API (MyAnimeList)**. Built with React and Tailwind CSS.

---

## 🔗 **Live Demo**
### 🚀 **[Click here to view the Live Site](https://https-github-com-xicoldes-anime-api.onrender.com/)**

---

## 🚀 Key Features

### **1. 🏠 Immersive Home Experience**
* **Cinematic Spotlight:** An auto-sliding hero section with high-quality visuals, English titles, and a clean interface (no dark overlays).
    * *Mobile Optimized:* Features a vertical gradient for readability and touch-friendly navigation.
* **True Trending Sidebar:** Displays the **Top 11-20** currently airing shows to complement the spotlight without duplicates.
* **Smart Filtering:** Sort content by **Genre**, **Popularity**, or **Score**.
* **Latest Episodes:** Real-time updates for currently airing series with a dedicated "View All" page.

### **2. 📚 Comprehensive Manga & Anime Database**
* **Extensive Library:** Browse thousands of manga titles and anime series with advanced deduplication.
* **Dedicated Listing Pages:** Separate, filterable pages for **Anime** (`/anime`), **Movies** (`/movies`), and **Manga** (`/manga`).
* **Robust Filtering:** Filter content by **Genre** directly on listing pages with smart caching to reduce API load.
* **Read Now Integration:** Smart buttons that dynamically link to reading sources based on the title.

### **3. 🔍 Smart Search & Discovery**
* **Universal Search Bar:** A powerful navbar search with a dropdown selector for **All**, **Series**, **Movies**, and **Manga**.
* **Live Results:** Instant dropdown feedback as you type with genre and type indicators.
* **Deep Linking:** Shareable search URLs (e.g., `/search?q=jujutsu&type=manga`).
* **Ban Filter System:** Integrated blacklist functionality to hide specific content IDs from search results and listing pages.

### **4. 📄 Rich Detail Pages**
* **Wiki Layout:** A classic 3-column design displaying metadata (Score, Rank, Popularity), synopsis, and background info.
* **Trailer Integration:** Watch official trailers directly on the page.
* **Character Grid:** Visual cast lists with roles (Main/Supporting).
* **Smart Links:** Context-aware genre tags that link to the correct category page (e.g., clicking "Action" on a movie page takes you to Action Movies).

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
* **State Management:** React Hooks (`useState`, `useEffect`, `useRef`) & Local Storage
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
│   ├── node_modules/         # Dependencies
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── assets/           # Images and global styles
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Hero.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Trending.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Anime.jsx     # NEW: Dedicated Anime listing page
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
│   │   ├── utils/            # Utility functions
│   │   │   └── banned.js     # Blacklist configuration
│   │   ├── App.css
│   │   ├── App.jsx           # Main Frontend Route Setup
│   │   ├── index.css         # Global Styles (Tailwind)
│   │   └── main.jsx          # React Entry Point
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── controllers/              # Backend Logic (Optional/Legacy)
│   └── animeController.js
├── routes/                   # Backend Routes (Optional/Legacy)
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

Rate Limits: You may experience a 429 error ("API is busy") if you refresh too rapidly. This is a limitation of the free API tier.

Data: All data is provided by MyAnimeList via Jikan.

Content filtering: A client-side blacklist is implemented in src/utils/banned.js to filter specific content IDs.


## 📝 License
This project is for educational purposes.
