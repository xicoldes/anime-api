import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Trending from '../components/Trending';
import { api } from '../services/api';
import { FaFilter, FaFilm, FaChevronRight, FaTimes, FaRedo } from 'react-icons/fa';

// The exact list of genres from your screenshot
const ALLOWED_GENRES = [
    'Action', 'Adventure', 'Cars', 'Comedy', 'Dementia', 'Demons', 'Drama', 
    'Ecchi', 'Fantasy', 'Game', 'Harem', 'Historical', 'Horror', 'Isekai', 'Josei', 
    'Kids', 'Magic', 'Martial Arts', 'Mecha', 'Military', 'Music', 'Mystery', 
    'Parody', 'Police', 'Psychological', 'Romance', 'Samurai', 'School', 'Sci-Fi', 
    'Seinen', 'Shoujo', 'Shoujo Ai', 'Shounen', 'Shounen Ai', 'Slice of Life', 
    'Space', 'Sports', 'Super Power', 'Supernatural', 'Thriller', 'Vampire'
];

const Home = () => {
  const [spotlight, setSpotlight] = useState([]); 
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [movies, setMovies] = useState([]); 
  const [genres, setGenres] = useState([]);
  
  const [searchParams] = useSearchParams();
  const location = useLocation(); 
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [filteredAnimes, setFilteredAnimes] = useState(null); 
  const [showFilter, setShowFilter] = useState(false);

  const dataFetched = useRef(false);

  // --- 1. OPTIMIZED DATA FETCHING ---
  useEffect(() => {
    if (dataFetched.current) return;
    dataFetched.current = true;

    const fetchData = async () => {
        try {
            // Spotlight (Hero)
            const spotlightData = await api.anime.getSpotlight();
            setSpotlight(spotlightData);
            
            // NEW: Trending Sidebar (Uses specific Trending API now)
            const trendingData = await api.anime.getTrending();
            setTrending(trendingData); // Pass the data array directly
            
        } catch (err) { console.error("Initial Load Error", err); }

        setTimeout(async () => {
            try {
                const latestData = await api.seasons.getNow();
                setLatest(latestData.data.data);
            } catch (err) { console.error("Latest Error", err); }
        }, 600);

        setTimeout(async () => {
            try {
                const movieData = await api.movies.getTop();
                setMovies(movieData.data.data);
                
                const genreData = await api.anime.getGenres();
                const safeGenres = genreData.data.data
                    .filter(g => ALLOWED_GENRES.includes(g.name))
                    .sort((a, b) => a.name.localeCompare(b.name));
                
                setGenres(safeGenres);

            } catch (err) { console.error("Background Load Error", err); }
        }, 1200);
    };
    fetchData();
  }, []);

  // --- 2. RESET STATE ON NAVIGATION ---
  useEffect(() => {
    if (location.pathname === '/' && !searchParams.toString()) {
        resetView();
    }
  }, [location, searchParams]);

  // Handle URL params
  useEffect(() => {
      const genreParam = searchParams.get('genre');
      if (genreParam) {
          const genreId = parseInt(genreParam);
          setSelectedGenre(genreId);
          setShowFilter(true);
          performSearch(genreId);
      }
  }, [searchParams]);

  const performSearch = async (genreId) => {
    try {
        const res = await api.anime.search('', genreId, 'members');
        setFilteredAnimes(res.data.data);
    } catch (err) {
        console.error(err);
    }
  };

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
    performSearch(genreId);
  };

  const resetView = () => {
      setSelectedGenre(null);
      setFilteredAnimes(null);
      setShowFilter(false);
  };

  // Helper to determine Title
  const getSectionTitle = () => {
      if (selectedGenre) {
          const genreName = genres.find(g => g.mal_id === selectedGenre)?.name;
          return genreName ? `Top ${genreName} Anime` : 'Search Results';
      }
      return 'Latest Episodes';
  };

  return (
    <div>
      {spotlight.length > 0 && <Hero animes={spotlight} />}

      <div className="max-w-[1400px] mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-3">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-3 self-start md:self-auto">
                    <h2 className="text-xl font-bold text-hianime-accent">
                        {getSectionTitle()}
                    </h2>
                    {filteredAnimes && (
                        <button onClick={resetView} className="text-xs text-red-400 hover:text-white flex items-center gap-1 bg-black/20 px-2 py-1 rounded border border-white/5 transition">
                            <FaRedo size={10} /> Reset
                        </button>
                    )}
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                    <button 
                        onClick={() => setShowFilter(!showFilter)} 
                        className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-bold transition ${
                            showFilter 
                            ? 'bg-hianime-accent text-black' 
                            : 'bg-[#202225] text-white hover:bg-white/10'
                        }`}
                    >
                        {showFilter ? <><FaTimes /> Close</> : <><FaFilter /> Filter</>}
                    </button>
                </div>
            </div>

            {/* --- CLEAN GENRE PANEL --- */}
            {showFilter && (
                <div className="bg-[#202225] p-6 rounded-xl mb-8 animate-fade-in border border-white/5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-bold text-sm">Genre</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {genres.map(genre => (
                            <button 
                                key={genre.mal_id}
                                onClick={() => handleGenreClick(genre.mal_id)}
                                className={`px-4 py-2 rounded-md text-sm transition border ${
                                    selectedGenre === genre.mal_id 
                                    ? 'bg-hianime-accent text-black border-hianime-accent font-bold' 
                                    : 'bg-[#151719] text-gray-400 border-[#2a2c31] hover:text-white hover:border-gray-500'
                                }`}
                            >
                                {genre.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* --- GRID RESULTS --- */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12 min-h-[500px]">
                {(filteredAnimes || latest.slice(0, 12)).map(anime => (
                    <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id} className="group relative cursor-pointer">
                        <div className="overflow-hidden rounded-lg aspect-[3/4] mb-2 relative">
                            <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                            <div className="absolute top-2 left-2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                {anime.score ? `★ ${anime.score}` : 'Ep ?'}
                            </div>
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-center items-center p-4 text-center">
                                <span className="text-hianime-accent text-sm font-bold mb-2">View Details</span>
                                <span className="text-xs text-gray-300">{anime.type} • {anime.year || 'N/A'}</span>
                            </div>
                        </div>
                        <h3 className="font-bold text-sm text-gray-200 group-hover:text-hianime-accent truncate transition">
                            {anime.title_english || anime.title}
                        </h3>
                    </Link>
                ))}
            </div>

            {/* --- MOVIES SECTION --- */}
            {(!selectedGenre && movies.length > 0) && (
                <div className="animate-slide-up">
                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                        <h2 className="text-xl font-bold text-hianime-accent flex items-center gap-2">
                            <FaFilm /> Popular Movies
                        </h2>
                        <Link to="/movies" className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1 transition">
                            View All <FaChevronRight size={10} />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {movies.slice(0, 8).map(movie => (
                            <Link to={`/anime/${movie.mal_id}`} key={movie.mal_id} className="group relative cursor-pointer">
                                <div className="overflow-hidden rounded-lg aspect-[3/4] mb-2 relative">
                                    <img src={movie.images.jpg.large_image_url} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                    <div className="absolute top-2 left-2 bg-hianime-accent text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm">MOVIE</div>
                                </div>
                                <h3 className="font-bold text-sm text-gray-200 group-hover:text-hianime-accent truncate transition">
                                    {movie.title_english || movie.title}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="lg:col-span-1">
            <Trending animes={trending} />
        </div>

      </div>
    </div>
  );
};

export default Home;