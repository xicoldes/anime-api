# 🍙 AnimeWiki - Ultimate Anime Discovery Platform

<img width="1919" height="1056" alt="image" src="https://github.com/user-attachments/assets/58948486-7493-4eba-8723-a98ebb2e0216" />




> A modern, responsive, and feature-rich anime discovery web application powered by the **Jikan API (MyAnimeList)**. Built with React and Tailwind CSS.

---

## 🔗 **Live Demo**
### 🚀 **[Click here to view the Live Site](https://https-github-com-xicoldes-anime-api.onrender.com/)**

---

## 🚀 Features

### **1. 🏠 Home Page**
* **Spotlight Slider:** A panoramic, auto-sliding hero section showcasing trending anime with a professional "Text-Left, Image-Right" layout.
    * *Interactive:* Supports click-and-drag (or swipe) navigation.
    * *Visuals:* Includes progress indicators and navigation dots.
* **Latest Episodes:** Real-time updates of currently airing episodes.
* **Popular Movies:** A dedicated section highlighting top-rated anime movies.
* **Trending Sidebar:** A quick-look vertical list of top-ranked series.
* **Smart Filtering:** Filter content by **Genre** or sort by **Popularity, Score, Name, Date, etc.**

### **2. 📚 Manga Database**
* **Extensive Library:** Browse thousands of manga titles.
* **Advanced Deduplication:** Ensures unique entries for cleaner browsing.
* **Pagination:** Smooth page navigation (Next/Prev/Numbered) to browse large collections.
* **Read Now Integration:** Direct "Read Now" button links to external reading sources (MangaKatana) dynamically based on the title.

### **3. 🔍 Advanced Search**
* **Real-time Results:** Search for Anime or Manga with instant feedback.
* **Smart Detection:** Automatically detects if searching for Anime or Manga based on the active page.
* **Deep Linking:** Shareable search URLs (e.g., `/search?q=naruto`).

### **4. 📄 Detailed Info Pages**
* **Rich Metadata:** Displays Score, Rank, Popularity, Members, and Synopsis.
* **Character Grid:** Shows main and supporting characters with images.
* **Related Entries:** Links to prequels, sequels, and side stories.
* **Author Wiki:** Quick links to search authors on Google/Wiki.

### **5. ❤️ User Collections (Watchlist)**
* **Local Storage Auth:** Simple login simulation (no backend required).
* **Bookmark System:** Add or remove Anime/Manga to your personal collection.
* **Persistent State:** Remembers your list even after refreshing.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite)
* **Styling:** Tailwind CSS
* **API:** Jikan API v4 (Unofficial MyAnimeList API)
* **Routing:** React Router DOM
* **Icons:** React Icons (FontAwesome)
* **Deployment:** Render

---

## 📦 Installation & Setup

1. **Clone the repository**
```bash
   git clone [https://github.com/your-username/animewiki.git](https://github.com/your-username/animewiki.git)
   cd animewiki
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
