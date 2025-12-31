import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import AnimeDetails from './pages/AnimeDetails';
import Manga from './pages/Manga';
import MangaDetails from './pages/MangaDetails'; // IMPORT THIS
import Watchlist from './pages/Watchlist';
import Login from './pages/Login';

function App() {
  return (
    <div className="min-h-screen bg-hianime-dark text-white font-sans selection:bg-hianime-accent selection:text-black">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/anime/:id" element={<AnimeDetails />} />
        
        {/* MANGA ROUTES */}
        <Route path="/manga" element={<Manga />} />
        <Route path="/manga/:id" element={<MangaDetails />} /> {/* ADD THIS */}

        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;