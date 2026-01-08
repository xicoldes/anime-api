import React, { useEffect, useState, useRef } from 'react'; // 1. Import useRef
import { Link, useSearchParams } from 'react-router-dom';
import Hero from '../components/Hero';
import Trending from '../components/Trending';
import { api } from '../services/api';
import { FaFilter, FaSortAmountDown, FaFilm, FaChevronRight } from 'react-icons/fa';

const Home = () => {
  const [spotlight, setSpotlight] = useState([]); 
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [movies, setMovies] = useState([]); 
  const [genres, setGenres] = useState([]);
  
  const [searchParams] = useSearchParams();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [filteredAnimes, setFilteredAnimes] = useState(null); 
  const [showFilter, setShowFilter] = useState(false);
  const [selectedSort, setSelectedSort] = useState('default');

  // --- STRICT MODE FIX ---
  const dataFetched = useRef(false); // Tracks if we already loaded data

  useEffect(() => {
    // If we already fetched data, STOP here.
    if (dataFetched.current) return;
    dataFetched.current = true;

    const fetchData = async () => {
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        try {
            console.log("Fetching Spotlight...");
            const spotlightData = await api.anime.getSpotlight();
            setSpotlight(spotlightData);
            await delay(600); 

            console.log("Fetching Trending...");
            const trendingRes = await api.top.getAnime();
            setTrending(trendingRes.data.data);
            await delay(600); 

            console.log("Fetching Latest...");
            const latestRes = await api.seasons.getNow();
            setLatest(latestRes.data.data);
            await delay(600);

            console.log("Fetching Movies...");
            const moviesRes = await api.movies.getTop();
            console.log("MOVIES FOUND:", moviesRes.data.data.length); // Debug Log
            setMovies(moviesRes.data.data);
            await delay(600);
            
            console.log("Fetching Genres...");
            const genresRes = await api.anime.getGenres();
            setGenres(genresRes.data.data);

        } catch (err) {
            console.error("API Error:", err);
        }
    };
    
    fetchData();
  }, []);

  // ... (Keep your second useEffect for 'searchParams' exactly as it is) ...
  useEffect(() => {
      const genreParam = searchParams.get('genre');
      if (genreParam) {
          const genreId = parseInt(genreParam);
          setSelectedGenre(genreId);
          setShowFilter(true);
          performSearch(genreId, selectedSort);
      }
  }, [searchParams]);

  // ... (Keep performSearch, handleGenreClick, handleSortChange, clearFilter as they are) ...
  const performSearch = async (genreId, sortValue) => { /* ... existing code ... */ };
  const handleGenreClick = (genreId) => { setSelectedGenre(genreId); performSearch(genreId, selectedSort); };
  const handleSortChange = (e) => { const sortValue = e.target.value; setSelectedSort(sortValue); performSearch(selectedGenre, sortValue); };
  const clearFilter = () => { setSelectedGenre(null); setSelectedSort('default'); setFilteredAnimes(null); };

  return (
    <div>
      {/* 1. Debugging Line: If this number is 0, the API failed. */}
      {/* <div className="text-white text-center bg-red-900">DEBUG: Movies Loaded: {movies.length}</div> */}

      {!filteredAnimes && spotlight.length > 0 && <Hero animes={spotlight} />}

      <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
            
            {/* ... (Keep Filter Header & Genre Panel exactly as they are) ... */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                {/* ... existing header code ... */}
                <h2 className="text-2xl font-bold text-hianime-accent self-start md:self-auto">
                    {filteredAnimes ? `Search Results` : `Latest Episodes`}
                </h2>
                {/* ... existing buttons ... */}
                <div className="flex gap-4 w-full md:w-auto">
                     {/* ... copy your existing sort/filter buttons here ... */}
                     <button onClick={() => setShowFilter(!showFilter)} className="flex items-center gap-2 bg-hianime-sidebar px-4 py-2 rounded text-sm hover:bg-hianime-accent hover:text-black transition">
                        <FaFilter /> Filter
                    </button>
                </div>
            </div>

             {/* ... (Keep Genre Filter Panel) ... */}
             {showFilter && (
                <div className="bg-hianime-sidebar p-6 rounded-xl mb-8 border border-white/5 animate-fade-in">
                    {/* ... existing genre buttons ... */}
                    <div className="flex flex-wrap gap-2">
                        {genres.map(genre => (
                            <button key={genre.mal_id} onClick={() => handleGenreClick(genre.mal_id)} className={`px-3 py-1 rounded text-xs transition ${selectedGenre === genre.mal_id ? 'bg-hianime-accent text-black font-bold' : 'bg-black/40 text-gray-300 hover:bg-white/10'}`}>{genre.name}</button>
                        ))}
                    </div>
                </div>
            )}

            {/* ... (Latest Episodes Grid - kept same) ... */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
                {(filteredAnimes || latest.slice(0, 12)).map(anime => (
                    <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id} className="group relative cursor-pointer">
                        <div className="overflow-hidden rounded-lg aspect-[3/4] mb-2 relative">
                            <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                            <div className="absolute top-2 left-2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm">Ep {anime.episodes || '?'}</div>
                        </div>
                        <h3 className="font-bold text-sm text-gray-200 group-hover:text-hianime-accent truncate transition">{anime.title}</h3>
                    </Link>
                ))}
            </div>

            {/* --- MOVIES SECTION (Logic Checked) --- */}
            {/* We removed !filteredAnimes for a moment to force render if movies exist */}
            {movies.length > 0 && !filteredAnimes && (
                <div className="animate-slide-up">
                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                        <h2 className="text-2xl font-bold text-hianime-accent flex items-center gap-2">
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
                                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">{movie.duration}</div>
                                </div>
                                <h3 className="font-bold text-sm text-gray-200 group-hover:text-hianime-accent truncate transition">{movie.title}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Error handling if everything is missing */}
            {movies.length === 0 && !filteredAnimes && latest.length > 0 && (
                <div className="text-gray-500 text-xs mt-4">Loading Movies... (If this takes too long, the API might be busy)</div>
            )}

            {filteredAnimes && filteredAnimes.length === 0 && (
                <div className="text-center text-gray-500 py-10">No anime found for this selection.</div>
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