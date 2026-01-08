AnimeWiki
AnimeWiki is a modern, responsive React application that serves as a comprehensive database for Anime, Manga, and Anime Movies. Built with a focus on sleek UI/UX (inspired by streaming platforms like h!anime), it utilizes the Jikan API (unofficial MyAnimeList API) to provide real-time data.

🚀 Features
1. Home Page
Dynamic Spotlight Slider: A panoramic, auto-sliding hero section showcasing trending anime with a "h!anime" style layout (Text on left, Image on right).

Latest Episodes: A grid view of currently airing anime episodes.

Popular Movies: A dedicated section for top-rated and popular anime movies.

Trending Sidebar: A vertical list of top-ranked anime.

Smart Filtering: Filter content by Genre or sort by Popularity, Score, Name, etc.

2. Advanced Search & Navigation
Live Search Bar: A dropdown search bar that instantly shows results with thumbnails as you type.

Context Aware: Automatically switches between searching Anime or Manga depending on which page you are viewing.

Dedicated Pages: Separate pages for Movies and Manga to keep content organized.

3. Detailed Information Pages
Anime Details: View synopsis, score, rank, studio, trailer, characters, voice actors, and related anime.

Manga Details: View authors, published dates, volumes, and related adaptations.

Clickable Metadata: Clicking on a genre or studio instantly redirects you to a filtered search or Google search for that studio.

4. User Features (Simulated)
Login System: A simulated login allowing users to "sign in" and access personal features without a backend database.

Watchlist & Collections:

Add to List: Users can add Anime to a Watchlist and Manga to a Collection.

Protected Actions: The "Add to List" button requires a user to be logged in.

My Collections Page: A dedicated dashboard displaying your saved Anime and Manga in separate, scrollable carousels.

🛠️ Tech Stack
Frontend Framework: React.js (Vite)

Styling: Tailwind CSS

Routing: React Router DOM (v6)

Icons: React Icons (FontAwesome)

HTTP Client: Axios

Data Source: Jikan API v4 (Open Source MyAnimeList API)

Deployment: Render

📦 Installation & Setup
Follow these steps to run the project locally on your machine.

Prerequisites
Node.js installed (v16 or higher recommended).

1. Clone the Repository
git clone https://github.com/yourusername/animewiki.git
cd animewiki

2. Install Dependencies
Navigate to the client folder (where the React app lives) and install the libraries:

cd client
npm install

3. Start the Development Server

npm run dev
The app should now be running at http://localhost:5173.

📂 Project Structure
Plaintext

client/
├── public/
├── src/
│   ├── components/
│   │   ├── Hero.jsx          # Spotlight slider with drag/swipe support
│   │   ├── Navbar.jsx        # Top navigation with Live Search logic
│   │   └── Trending.jsx      # Sidebar for top ranked anime
│   ├── pages/
│   │   ├── Home.jsx          # Main landing page with filters
│   │   ├── AnimeDetails.jsx  # Individual anime info page
│   │   ├── Manga.jsx         # Top Manga browsing page
│   │   ├── MangaDetails.jsx  # Individual manga info page
│   │   ├── Movies.jsx        # Top Movies browsing page
│   │   ├── Login.jsx         # Simulated login page
│   │   ├── Search.jsx        # Full search results page
│   │   └── Watchlist.jsx     # User's saved collections
│   ├── services/
│   │   └── api.js            # Centralized Axios API configuration
│   ├── App.jsx               # Main routing setup
│   ├── main.jsx              # Entry point
│   └── index.css             # Tailwind imports and global styles
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
🚀 Deployment
This project is configured for deployment on Render.

Build Command: npm install; npm run build

Publish Directory: dist

Root Directory: client (Important!)

⚠️ API Note
This project uses the free Jikan API.

Rate Limits: The API has a rate limit. If you refresh too quickly, you might see a 429 error. Just wait a moment and try again.

Stability: Occasionally the API may be down for maintenance.

📝 License
This project is for educational purposes. Data provided by MyAnimeList via Jikan API.