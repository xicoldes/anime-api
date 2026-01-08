# AnimeWiki 🎥

AnimeWiki is a modern, responsive React application serving as a comprehensive database for Anime, Manga, and Movies. Built with a focus on sleek UI/UX inspired by top streaming platforms, it utilizes the **Jikan API** (unofficial MyAnimeList API) to provide real-time data.

![AnimeWiki Preview](https://via.placeholder.com/1000x500?text=AnimeWiki+Screenshot) 
*(Replace this link with a real screenshot of your app later!)*

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
git clone [https://github.com/yourusername/animewiki.git](https://github.com/yourusername/animewiki.git)
cd animewiki
2. Install Dependencies
Navigate to the client folder where the React app lives:

Bash

cd client
npm install
3. Start the Development Server
Bash

npm run dev
The app will launch at http://localhost:5173.

📂 Project Structure
Plaintext

client/
├── public/
├── src/
│   ├── components/
│   │   ├── Hero.jsx          # Spotlight slider logic
│   │   ├── Navbar.jsx        # Top nav with Live Search
│   │   └── Trending.jsx      # Sidebar rankings
│   ├── pages/
│   │   ├── Home.jsx          # Landing page with filters
│   │   ├── AnimeDetails.jsx  # Single anime info
│   │   ├── Manga.jsx         # Top Manga list
│   │   ├── MangaDetails.jsx  # Single manga info
│   │   ├── Movies.jsx        # Top Movies list
│   │   ├── Login.jsx         # Simulated login
│   │   ├── Search.jsx        # Search results grid
│   │   └── Watchlist.jsx     # User collections dashboard
│   ├── services/
│   │   └── api.js            # Centralized Jikan API config
│   ├── App.jsx               # Route definitions
│   ├── main.jsx              # App entry point
│   └── index.css             # Tailwind imports
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js

🚀 Deployment (Render)
This project is optimized for deployment on Render.

New Static Site: Connect your GitHub repo.

Root Directory: client

Build Command: npm install; npm run build

Publish Directory: dist

Note: If you encounter a "Route not found" error on refresh, you may need to add a rewrite rule in Render settings (Source: /* -> Destination: /index.html).

⚠️ Disclaimer
This project uses the free Jikan API.

Rate Limits: You may experience a 429 error if you refresh too rapidly. This is a limitation of the free API tier.

Data: All data is provided by MyAnimeList via Jikan.

📝 License
This project is for educational purposes.