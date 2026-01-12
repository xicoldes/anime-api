import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Components
import Navbar from './components/Navbar';

// Import Pages
import Home from './pages/Home';
import AnimeDetails from './pages/AnimeDetails';
import Anime from './pages/Anime'; // IMPORT ADDED
import Manga from './pages/Manga';
import MangaDetails from './pages/MangaDetails';
import Movies from './pages/Movies'; 
import Search from './pages/Search';
import Login from './pages/Login';
import Watchlist from './pages/Watchlist';

function App() {
  return (
    <> 
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Anime Routes */}
        <Route path="/anime" element={<Anime />} /> {/* ROUTE ADDED */}
        <Route path="/anime/:id" element={<AnimeDetails />} />
        
        {/* Manga Routes */}
        <Route path="/manga" element={<Manga />} />
        <Route path="/manga/:id" element={<MangaDetails />} />
        
        {/* Movie Route */}
        <Route path="/movies" element={<Movies />} />
        
        {/* Functional Routes */}
        <Route path="/search" element={<Search />} />
        <Route path="/search/:query" element={<Search />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/watchlist" element={<Watchlist />} />
      </Routes>
    </>
  );
}

export default App;