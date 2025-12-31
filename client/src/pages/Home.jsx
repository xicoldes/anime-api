import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Trending from '../components/Trending';
import { api } from '../services/api';
import { FaFilter } from 'react-icons/fa';

const Home = () => {
  const [spotlight, setSpotlight] = useState([]); 
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [filteredAnimes, setFilteredAnimes] = useState(null); // Stores result of filter
  const [showFilter, setShowFilter] = useState(false); // Toggle filter panel

  useEffect(() => {
    const fetchData = async () => {
      try {
        const spotlightData = await api.anime.getSpotlight();
        setSpotlight(spotlightData);

        const trendingData = await api.top.getAnime();
        setTrending(trendingData.data.data);

        const seasonData = await api.seasons.getNow();
        setLatest(seasonData.data.data);
        
        // Fetch Genres for the filter
        const genreData = await api.anime.getGenres();
        setGenres(genreData.data.data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, []);

  // Handle Genre Click
  const handleGenreClick = async (genreId) => {
    setSelectedGenre(genreId);
    try {
        // Search with empty query but specific genre ID
        const res = await api.anime.search('', genreId);
        setFilteredAnimes(res.data.data);
    } catch (err) {
        console.error(err);
    }
  };

  const clearFilter = () => {
      setSelectedGenre(null);
      setFilteredAnimes(null);
  };

  return (
    <div>
      {/* Show Hero only if not filtering */}
      {!filteredAnimes && spotlight.length > 0 && <Hero animes={spotlight} />}

      <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-3">
            
            {/* Filter Toggle Bar */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-hianime-accent">
                    {filteredAnimes ? `Genre Results` : `Latest Episodes`}
                </h2>
                <button 
                    onClick={() => setShowFilter(!showFilter)} 
                    className="flex items-center gap-2 bg-hianime-sidebar px-4 py-2 rounded text-sm hover:bg-hianime-accent hover:text-black transition"
                >
                    <FaFilter /> Filter
                </button>
            </div>

            {/* Filter Panel (Hidden by default) */}
            {showFilter && (
                <div className="bg-hianime-sidebar p-6 rounded-xl mb-8 border border-white/5 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-bold">Select Genre</h3>
                        {selectedGenre && <button onClick={clearFilter} className="text-xs text-red-400 hover:underline">Clear Filter</button>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {genres.map(genre => (
                            <button 
                                key={genre.mal_id}
                                onClick={() => handleGenreClick(genre.mal_id)}
                                className={`px-3 py-1 rounded text-xs transition ${
                                    selectedGenre === genre.mal_id 
                                    ? 'bg-hianime-accent text-black font-bold' 
                                    : 'bg-black/40 text-gray-300 hover:bg-white/10'
                                }`}
                            >
                                {genre.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Anime Grid (Shows either Filtered Results or Latest) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(filteredAnimes || latest.slice(0, 12)).map(anime => (
                    <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id} className="group relative cursor-pointer">
                        <div className="overflow-hidden rounded-lg aspect-[3/4] mb-2 relative">
                            <img 
                                src={anime.images.jpg.large_image_url} 
                                alt={anime.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                            />
                            {/* Episode Badge */}
                            <div className="absolute top-2 left-2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                Ep {anime.episodes || '?'}
                            </div>
                            {/* Hover Overlay with Info */}
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-center items-center p-4 text-center">
                                <span className="text-hianime-accent text-sm font-bold mb-2">View Details</span>
                                <span className="text-xs text-gray-300">{anime.type} • {anime.year || 'N/A'}</span>
                            </div>
                        </div>
                        <h3 className="font-bold text-sm text-gray-200 group-hover:text-hianime-accent truncate transition">
                            {anime.title}
                        </h3>
                    </Link>
                ))}
            </div>
            
            {/* Show message if filter returns nothing */}
            {filteredAnimes && filteredAnimes.length === 0 && (
                <div className="text-center text-gray-500 py-10">No anime found for this genre.</div>
            )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
            <Trending animes={trending} />
        </div>

      </div>
    </div>
  );
};

export default Home;