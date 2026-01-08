# AnimeWiki 🎥

AnimeWiki is a modern, responsive React application serving as a comprehensive database for Anime, Manga, and Movies. Built with a focus on sleek UI/UX inspired by top streaming platforms, it utilizes the **Jikan API** (unofficial MyAnimeList API) to provide real-time data.

<img width="1919" height="1057" alt="Screenshot 2026-01-09 033559" src="https://github.com/user-attachments/assets/6ae4281f-1dc9-4f25-a164-923c91deddb5" />


## 🚀 Features

### **1. 🏠 Home Page**
* **Spotlight Slider:** A panoramic, auto-sliding hero section showcasing trending anime with a professional "Text-Left, Image-Right" layout.
    * *Interactive:* Supports click-and-drag (or swipe) navigation.
    * *Visuals:* Includes progress indicators and navigation dots.
* **Latest Episodes:** Real-time updates of currently airing episodes.
* **Popular Movies:** A dedicated section highlighting top-rated anime movies.
* **Trending Sidebar:** A quick-look vertical list of top-ranked series.
* **Smart Filtering:** Filter content by **Genre** or sort by **Popularity, Score, Name, Date, etc.**

### **2. 🔍 Advanced Search**
* **Live Search Bar:** A smart dropdown that instantly shows results with thumbnails as you type.
    * *Context Aware:* Automatically switches between searching **Anime** or **Manga** based on the current page.
* **Dedicated Search Page:** A full results grid for deep diving into specific queries.

### **3. 📚 Content Databases**
* **Movies Page:** A standalone page ranking the top Anime Movies of all time.
* **Manga Page:** A dedicated section for browsing top-rated Manga.
* **Detailed Info:**
    * **Anime:** Synopsis, score, rank, trailer, characters, voice actors, and relations.
    * **Manga:** Authors, volumes, published dates, and genres.
    * **External Links:** Clickable studios and authors redirect to Google searches.

### **4. 👤 User Features (Simulated)**
* **Login System:** A lightweight, frontend-only authentication system using LocalStorage.
* **My Collections:**
    * **Watchlist:** Save your favorite Anime.
    * **Manga Collection:** Save Manga you are reading.
    * *Note:* "Add to List" buttons are protected and require login.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite)
* **Styling:** Tailwind CSS
* **Routing:** React Router DOM (v6)
* **Icons:** React Icons (FontAwesome)
* **Data Fetching:** Axios
* **API:** [Jikan API v4](https://jikan.moe/)
* **Deployment:** Render

---

## 📦 Installation & Setup

Follow these steps to run the project locally.

### **1. Clone the Repository**
```bash
git clone https://github.com/xicoldes/animewiki.git

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
