import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import AnimeDetails from './pages/AnimeDetails';
import Manga from './pages/Manga'; // Import the new page

function App() {
  return (
    <div className="min-h-screen bg-hianime-dark text-white font-sans selection:bg-hianime-accent selection:text-black">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/anime/:id" element={<AnimeDetails />} />
        <Route path="/manga" element={<Manga />} />
      </Routes>
    </div>
  );
}

export default App;