import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Trending from '../components/Trending';
import { api } from '../services/api';
import { FaFilter, FaSortAmountDown } from 'react-icons/fa';

const Home = () => {
  const [spotlight, setSpotlight] = useState([]); 
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [genres, setGenres] = useState([]);
  
  // Filter & Sort State
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [filteredAnimes, setFilteredAnimes] = useState(null); 
  const [showFilter, setShowFilter] = useState(false);
  const [selectedSort, setSelectedSort] = useState('default');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const spotlightData = await api.anime.getSpotlight();
        setSpotlight(spotlightData);

        const trendingData = await api.top.getAnime();
        setTrending(trendingData.data.data);

        const seasonData = await api.seasons.getNow();
        setLatest(seasonData.data.data);
        
        const genreData = await api.anime.getGenres();
        setGenres(genreData.data.data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, []);

  // Centralized Search (Handles Genre + Sort)
  const performSearch = async (genreId, sortValue) => {
    let orderBy = null;
    let sort = 'desc'; 

    switch(sortValue) {
        case 'score': orderBy = 'score'; break;
        case 'popularity': orderBy = 'popularity'; break;
        case 'title': orderBy = 'title'; sort = 'asc'; break;
        case 'start_date': orderBy = 'start_date'; break;
        case 'episodes': orderBy = 'episodes'; break; // Specific to Anime
        case 'favorites': orderBy = 'favorites'; break;
        default: orderBy = null;
    }

    try {
        if (orderBy || genreId) {
            const res = await api.anime.search('', genreId, orderBy, sort);
            setFilteredAnimes(res.data.data);
        } else {
            setFilteredAnimes(null); // Reset to default "Latest" view
        }
    } catch (err) {
        console.error(err);
    }
  };

  // Handlers
  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
    performSearch(genreId, selectedSort);
  };

  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    setSelectedSort(sortValue);
    performSearch(selectedGenre, sortValue);
  };

  const clearFilter = () => {
      setSelectedGenre(null);
      setSelectedSort('default');
      setFilteredAnimes(null);
  };

  return (
    <div>
      {/* Show Hero only if not filtering */}
      {!filteredAnimes && spotlight.length > 0 && <Hero animes={spotlight} />}

      <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-3">
            
            {/* Header Bar with Sort & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-hianime-accent self-start md:self-auto">
                    {filteredAnimes ? `Search Results` : `Latest Episodes`}
                </h2>
                
                <div className="flex gap-4 w-full md:w-auto">
                    {/* SORT DROPDOWN */}
                    <div className="relative flex items-center bg-hianime-sidebar px-3 py-2 rounded border border-white/10">
                        <FaSortAmountDown className="text-gray-400 mr-2" />
                        <select 
                            value={selectedSort}
                            onChange={handleSortChange}
                            className="bg-transparent text-sm text-white outline-none cursor-pointer appearance-none pr-8"
                        >
                            <option value="default" className="text-black">Default</option>
                            <option value="score" className="text-black">Highest Score</option>
                            <option value="popularity" className="text-black">Most Popular</option>
                            <option value="title" className="text-black">Name A-Z</option>
                            <option value="start_date" className="text-black">Release Date</option>
                            <option value="episodes" className="text-black">Episode Count</option>
                        </select>
                    </div>

                    <button 
                        onClick={() => setShowFilter(!showFilter)} 
                        className="flex items-center gap-2 bg-hianime-sidebar px-4 py-2 rounded text-sm hover:bg-hianime-accent hover:text-black transition"
                    >
                        <FaFilter /> Filter
                    </button>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilter && (
                <div className="bg-hianime-sidebar p-6 rounded-xl mb-8 border border-white/5 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-bold">Select Genre</h3>
                        {(selectedGenre || selectedSort !== 'default') && (
                            <button onClick={clearFilter} className="text-xs text-red-400 hover:underline">Clear All</button>
                        )}
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

            {/* Anime Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(filteredAnimes || latest.slice(0, 12)).map(anime => (
                    <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id} className="group relative cursor-pointer">
                        <div className="overflow-hidden rounded-lg aspect-[3/4] mb-2 relative">
                            <img 
                                src={anime.images.jpg.large_image_url} 
                                alt={anime.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                            />
                            <div className="absolute top-2 left-2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                Ep {anime.episodes || '?'}
                            </div>
                            {/* Hover Overlay */}
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
            
            {filteredAnimes && filteredAnimes.length === 0 && (
                <div className="text-center text-gray-500 py-10">No anime found for this selection.</div>
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