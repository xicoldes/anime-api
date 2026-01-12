import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlayCircle, FaClock, FaRedo, FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight, FaTimes, FaFilter } from 'react-icons/fa';
import { BANNED_IDS } from '../utils/banned'; // Import the Blacklist

const Anime = () => {
  const [animes, setAnimes] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const genreParam = searchParams.get('genre');
  const pageParam = searchParams.get('page');
  
  const selectedGenre = genreParam ? parseInt(genreParam) : null;
  const page = pageParam ? parseInt(pageParam) : 1;

  const [pagination, setPagination] = useState({ has_next_page: false, last_visible_page: 1 });

  // 1. Fetch Genres (Cached)
  useEffect(() => {
    const fetchGenres = async () => {
      const cachedGenres = localStorage.getItem('animewiki_genres');
      if (cachedGenres) {
          const parsed = JSON.parse(cachedGenres);
          if (Array.isArray(parsed) && parsed.length > 0) {
              setGenres(parsed);
              return; 
          }
      }

      try {
        const results = await Promise.allSettled([
            axios.get('https://api.jikan.moe/v4/genres/anime'),
            axios.get('https://api.jikan.moe/v4/genres/anime?filter=themes'),
            axios.get('https://api.jikan.moe/v4/genres/anime?filter=demographics')
        ]);

        const combinedGenres = results
            .filter(r => r.status === 'fulfilled')
            .flatMap(r => r.value.data.data);

        const uniqueGenres = Array.from(
            new Map(combinedGenres.map(item => [item.mal_id, item])).values()
        ).sort((a, b) => a.name.localeCompare(b.name));

        if (uniqueGenres.length > 0) {
            setGenres(uniqueGenres);
            localStorage.setItem('animewiki_genres', JSON.stringify(uniqueGenres));
        }

      } catch (err) { console.error("Genre Error", err); }
    };
    fetchGenres();
  }, []);

  // 2. Main Data Fetching (With Ban Filter & Type Fixes)
  const fetchData = async (retryCount = 0) => {
    if (retryCount === 0) setLoading(true);
    setError(null);
    
    await new Promise(resolve => setTimeout(resolve, 350)); 

    try {
        let url;
        if (selectedGenre) {
            // FILTER MODE: Search by Genre (Restricted to TV)
            url = `https://api.jikan.moe/v4/anime?sfw=true&type=tv&genres=${selectedGenre}&order_by=members&sort=desc&page=${page}`;
        } else {
            // DEFAULT MODE: Seasonal Now (Restricted to TV)
            url = `https://api.jikan.moe/v4/seasons/now?sfw=true&filter=tv&page=${page}`;
        }

        const res = await axios.get(url);
        
        if (res.data.data) {
            // --- FIXED BAN FUNCTION ---
            // Converts both IDs to strings to ensure "20" matches 20
            const cleanData = res.data.data.filter(item => {
                const isBanned = BANNED_IDS.some(bannedId => String(bannedId) === String(item.mal_id));
                return !isBanned;
            });

            setAnimes(cleanData);
            setPagination(res.data.pagination || { has_next_page: false });
            setLoading(false);
        } else {
            throw new Error("No data returned");
        }

    } catch (err) {
        console.error(`Fetch Error (Attempt ${retryCount + 1}):`, err);
        
        if (retryCount < 3) {
            setTimeout(() => fetchData(retryCount + 1), 1500);
        } else {
            setAnimes([]);
            setError("API is currently busy. Please try again in a moment.");
            setLoading(false);
        }
    }
  };

  useEffect(() => {
    fetchData(); 
  }, [selectedGenre, page]);

  // --- Handlers ---
  const handlePageChange = (newPage) => {
      if (newPage < 1) return;
      if (pagination.last_visible_page && newPage > pagination.last_visible_page) return;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      const query = selectedGenre ? `?genre=${selectedGenre}&page=${newPage}` : `?page=${newPage}`;
      navigate(`/anime${query}`);
  };

  const handleGenreClick = (genreId) => {
      navigate(`/anime?genre=${genreId}&page=1`);
  };

  const resetView = () => {
      setShowFilter(false);
      navigate('/anime');
  };

  const getPageTitle = () => {
      if (selectedGenre) {
          const genreName = genres.find(g => g.mal_id === selectedGenre)?.name;
          return genreName ? `Top ${genreName} Anime` : 'Anime Results';
      }
      return 'Latest Episodes';
  };

  if (loading && !animes.length) {
      return <div className="min-h-screen pt-32 text-center text-hianime-accent font-bold text-xl">Loading...</div>;
  }

  return (
    <div className="pt-24 min-h-screen max-w-[1400px] mx-auto px-4 pb-20">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-3 self-start md:self-auto">
                <h1 className="text-2xl font-bold text-white border-l-4 border-hianime-accent pl-4 flex items-center gap-3">
                    <FaPlayCircle /> {getPageTitle()}
                </h1>
                {selectedGenre && (
                    <button onClick={resetView} className="text-xs text-red-400 hover:text-white flex items-center gap-1 bg-black/20 px-2 py-1 rounded border border-white/5 transition">
                        <FaRedo size={10} /> Reset
                    </button>
                )}
            </div>

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

        {/* --- GENRE PANEL --- */}
        {showFilter && (
            <div className="bg-[#202225] p-6 rounded-xl mb-8 animate-fade-in border border-white/5">
                <div className="flex justify-between items-center mb-4"><h3 className="text-white font-bold text-sm">Filter by Genre (TV Series Only)</h3></div>
                
                {genres.length > 0 ? (
                    <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-hianime-accent">
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
                ) : (
                    <div className="text-gray-500 italic text-sm">Loading genres...</div>
                )}
            </div>
        )}

        {/* --- ERROR / EMPTY STATE --- */}
        {!loading && animes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 animate-fade-in">
                <p className="text-lg mb-4">{error || "No anime found."}</p>
                <button 
                    onClick={() => fetchData(0)} 
                    className="px-6 py-2 bg-hianime-accent text-black rounded-full font-bold hover:bg-white transition"
                >
                    Retry Connection
                </button>
            </div>
        )}

        {/* --- ANIME GRID --- */}
        {animes.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {animes.map(anime => (
                    <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id} className="group cursor-pointer">
                        <div className="overflow-hidden rounded-lg aspect-[3/4] mb-3 relative">
                            <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                            <div className="absolute top-2 left-2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                {anime.score ? `★ ${anime.score}` : 'Ep ?'}
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                                <FaPlayCircle className="text-white text-4xl drop-shadow-lg" />
                            </div>
                        </div>
                        
                        <h3 className="font-bold text-sm text-gray-200 group-hover:text-hianime-accent truncate transition">
                            {anime.title_english || anime.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1"><FaClock className="text-[10px]"/> {anime.duration || '24m'}</span>
                            <span>•</span>
                            <span>{anime.year || 'N/A'}</span>
                        </div>
                    </Link>
                ))}
            </div>
        )}

        {/* --- PAGINATION --- */}
        {animes.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-12 animate-fade-in">
                <button onClick={() => handlePageChange(1)} disabled={page === 1} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#202225] text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition"><FaAngleDoubleLeft /></button>
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#202225] text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition"><FaAngleLeft /></button>
                
                <div className="flex gap-2">
                    {[page - 2, page - 1, page, page + 1, page + 2].map(p => {
                        if (p < 1 || (pagination.last_visible_page && p > pagination.last_visible_page)) return null;
                        return (
                            <button key={p} onClick={() => handlePageChange(p)} className={`w-10 h-10 rounded-full font-bold text-sm transition shadow-lg ${page === p ? 'bg-hianime-accent text-black scale-110 shadow-pink-500/20' : 'bg-[#202225] text-gray-400 hover:bg-white/10'}`}>{p}</button>
                        );
                    })}
                </div>

                <button onClick={() => handlePageChange(page + 1)} disabled={!pagination.has_next_page} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#202225] text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition"><FaAngleRight /></button>
                <button onClick={() => handlePageChange(pagination.last_visible_page || page + 1)} disabled={!pagination.has_next_page} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#202225] text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition"><FaAngleDoubleRight /></button>
            </div>
        )}
    </div>
  );
};

export default Anime;