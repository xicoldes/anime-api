import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { FaFilter, FaFilm, FaClock, FaStar, FaTimes, FaRedo, FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa';

const ALLOWED_GENRES = [
    'Action', 'Adventure', 'Cars', 'Comedy', 'Dementia', 'Demons', 'Drama', 
    'Ecchi', 'Fantasy', 'Game', 'Harem', 'Historical', 'Horror', 'Isekai', 'Josei', 
    'Kids', 'Magic', 'Martial Arts', 'Mecha', 'Military', 'Music', 'Mystery', 
    'Parody', 'Police', 'Psychological', 'Romance', 'Samurai', 'School', 'Sci-Fi', 
    'Seinen', 'Shoujo', 'Shoujo Ai', 'Shounen', 'Shounen Ai', 'Slice of Life', 
    'Space', 'Sports', 'Super Power', 'Supernatural', 'Thriller', 'Vampire'
];

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  
  // --- PAGINATION STATE ---
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ has_next_page: false, last_visible_page: 1 });

  const dataFetched = useRef(false);

  useEffect(() => {
    if (dataFetched.current) return;
    dataFetched.current = true;
    fetchData(1, null);
  }, []);

  const fetchData = async (pageNum, genreId) => {
    setLoading(true);
    try {
        if (genres.length === 0) {
            const genreRes = await api.anime.getGenres();
            const safeGenres = genreRes.data.data
                .filter(g => ALLOWED_GENRES.includes(g.name))
                .sort((a, b) => a.name.localeCompare(b.name));
            setGenres(safeGenres);
        }

        const res = await api.movies.search(genreId, 'members', pageNum);
        
        setMovies(res.data.data);
        setPagination(res.data.pagination);

    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
      if (newPage < 1 || (pagination.last_visible_page && newPage > pagination.last_visible_page)) return;
      setPage(newPage);
      fetchData(newPage, selectedGenre);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenreClick = (genreId) => {
      setSelectedGenre(genreId);
      setPage(1); // Reset to page 1
      fetchData(1, genreId);
  };

  const resetView = () => {
      setSelectedGenre(null);
      setShowFilter(false);
      setPage(1); // Reset to page 1
      fetchData(1, null);
  };

  const getPageTitle = () => {
      if (selectedGenre) {
          const genreName = genres.find(g => g.mal_id === selectedGenre)?.name;
          return `Top ${genreName} Movies`;
      }
      return 'Top Anime Movies';
  };

  if (loading && !movies.length) return <div className="min-h-screen pt-32 text-center text-hianime-accent">Loading Movies...</div>;

  return (
    <div className="pt-24 min-h-screen max-w-[1400px] mx-auto px-4 pb-20">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-3 self-start md:self-auto">
                <h1 className="text-2xl font-bold text-white border-l-4 border-hianime-accent pl-4 flex items-center gap-3">
                    <FaFilm /> {getPageTitle()}
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
                <div className="flex justify-between items-center mb-4"><h3 className="text-white font-bold text-sm">Genre</h3></div>
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

        {/* --- MOVIES GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map(movie => (
                <Link to={`/anime/${movie.mal_id}`} key={movie.mal_id} className="group cursor-pointer">
                    <div className="overflow-hidden rounded-lg aspect-[3/4] mb-3 relative">
                        <img src={movie.images.jpg.large_image_url} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <div className="absolute top-2 left-2 bg-hianime-accent text-black text-[10px] font-bold px-2 py-0.5 rounded-sm">
                            #{movie.rank || '?'}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <FaStar className="text-yellow-400 text-[8px]" /> {movie.score}
                        </div>
                    </div>
                    
                    {/* ENGLISH TITLE CHANGE HERE */}
                    <h3 className="font-bold text-sm text-gray-200 group-hover:text-hianime-accent truncate transition">
                        {movie.title_english || movie.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><FaClock className="text-[10px]"/> {movie.duration}</span>
                        <span>•</span>
                        <span>{movie.year || 'N/A'}</span>
                    </div>
                </Link>
            ))}
        </div>
        
        {!loading && movies.length === 0 && (
            <div className="text-center text-gray-500 py-20">No movies found.</div>
        )}

        {/* --- PAGINATION COMPONENT --- */}
        {movies.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-12 animate-fade-in">
                <button onClick={() => handlePageChange(1)} disabled={page === 1} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#202225] text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition"><FaAngleDoubleLeft /></button>
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#202225] text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition"><FaAngleLeft /></button>
                
                <div className="flex gap-2">
                    {[page - 2, page - 1, page, page + 1, page + 2].map(p => {
                        if (p < 1 || (pagination.last_visible_page && p > pagination.last_visible_page)) return null;
                        return (
                            <button 
                                key={p} 
                                onClick={() => handlePageChange(p)} 
                                className={`w-10 h-10 rounded-full font-bold text-sm transition shadow-lg ${
                                    page === p 
                                    ? 'bg-hianime-accent text-black scale-110 shadow-pink-500/20' 
                                    : 'bg-[#202225] text-gray-400 hover:bg-white/10'
                                }`}
                            >
                                {p}
                            </button>
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

export default Movies;