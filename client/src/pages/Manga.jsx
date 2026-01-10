import React, { useEffect, useState, useRef } from 'react';
import { api } from '../services/api';
import { Link, useSearchParams } from 'react-router-dom'; 
import { FaStar, FaBookOpen, FaFilter, FaTimes, FaRedo, FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa';

// Same Allowed Genres List
const ALLOWED_GENRES = [
    'Action', 'Adventure', 'Cars', 'Comedy', 'Dementia', 'Demons', 'Drama', 
    'Ecchi', 'Fantasy', 'Game', 'Harem', 'Historical', 'Horror', 'Isekai', 'Josei', 
    'Kids', 'Magic', 'Martial Arts', 'Mecha', 'Military', 'Music', 'Mystery', 
    'Parody', 'Police', 'Psychological', 'Romance', 'Samurai', 'School', 'Sci-Fi', 
    'Seinen', 'Shoujo', 'Shoujo Ai', 'Shounen', 'Shounen Ai', 'Slice of Life', 
    'Space', 'Sports', 'Super Power', 'Supernatural', 'Thriller', 'Vampire'
];

const Manga = () => {
  const [mangaList, setMangaList] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  
  // --- PAGINATION STATE ---
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ has_next_page: false, last_visible_page: 1 });
  
  const dataFetched = useRef(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (dataFetched.current) return;
    dataFetched.current = true;

    const fetchInitialData = async () => {
        try {
            // 1. Get Genres
            const genreRes = await api.manga.getGenres();
            
            // --- FIX: DEDUPLICATION LOGIC ---
            const uniqueGenres = [];
            const seenNames = new Set();
            
            genreRes.data.data.forEach(g => {
                if (ALLOWED_GENRES.includes(g.name) && !seenNames.has(g.name)) {
                    uniqueGenres.push(g);
                    seenNames.add(g.name);
                }
            });
            
            uniqueGenres.sort((a, b) => a.name.localeCompare(b.name));
            setGenres(uniqueGenres);

            // 2. CHECK: Do we have a genre in the URL?
            if (searchParams.get('genre')) return;

            // 3. Get Top Manga (Page 1)
            await fetchData(1, null);

        } catch (err) {
            console.error(err);
        } finally {
            if (!searchParams.get('genre')) setLoading(false);
        }
    };
    fetchInitialData();
  }, []);

  // Handle URL Params
  useEffect(() => {
      const genreParam = searchParams.get('genre');
      if (genreParam) {
          const genreId = parseInt(genreParam);
          setSelectedGenre(genreId);
          setShowFilter(true);
          setPage(1);
          fetchData(1, genreId);
      }
  }, [searchParams]);

  // --- UNIFIED FETCH FUNCTION ---
  const fetchData = async (pageNum, genreId) => {
      setLoading(true);
      try {
          let res;
          if (genreId) {
             res = await api.manga.search('', genreId, 'members', pageNum);
          } else {
             // Pass pageNum to getTop (requires api.js update to accept page, or use search fallback)
             // Using search with no query to act as "browse all" which supports pagination better
             res = await api.manga.search('', null, 'members', pageNum);
          }
          
          setMangaList(res.data.data);
          setPagination(res.data.pagination); // Store pagination data
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
      setPage(1);
      fetchData(1, genreId);
  };

  const resetView = () => {
      setSelectedGenre(null);
      setShowFilter(false);
      setPage(1);
      fetchData(1, null);
  };

  const getPageTitle = () => {
      if (selectedGenre) {
          const genreName = genres.find(g => g.mal_id === selectedGenre)?.name;
          return `Top ${genreName} Manga`;
      }
      return 'Top Manga';
  };

  if (loading && !mangaList.length) return <div className="min-h-screen pt-32 text-center text-hianime-accent">Loading Manga...</div>;

  return (
    <div className="pt-24 min-h-screen max-w-[1400px] mx-auto px-6 pb-20">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-3 self-start md:self-auto">
                <h1 className="text-2xl font-bold text-white border-l-4 border-hianime-accent pl-4 flex items-center gap-3">
                    <FaBookOpen /> {getPageTitle()}
                </h1>
                {selectedGenre && (
                    <button onClick={resetView} className="text-xs text-red-400 hover:text-white flex items-center gap-1 bg-black/20 px-2 py-1 rounded border border-white/5 transition">
                        <FaRedo size={10} /> Reset
                    </button>
                )}
            </div>
            <button onClick={() => setShowFilter(!showFilter)} className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-bold transition ${showFilter ? 'bg-hianime-accent text-black' : 'bg-[#202225] text-white hover:bg-white/10'}`}>
                {showFilter ? <><FaTimes /> Close</> : <><FaFilter /> Filter</>}
            </button>
        </div>

        {/* --- GENRE PANEL --- */}
        {showFilter && (
            <div className="bg-[#202225] p-6 rounded-xl mb-8 animate-fade-in border border-white/5">
                <div className="flex justify-between items-center mb-4"><h3 className="text-white font-bold text-sm">Genre</h3></div>
                <div className="flex flex-wrap gap-2">
                    {genres.map(genre => (
                        <button key={genre.mal_id} onClick={() => handleGenreClick(genre.mal_id)} className={`px-4 py-2 rounded-md text-sm transition border ${selectedGenre === genre.mal_id ? 'bg-hianime-accent text-black border-hianime-accent font-bold' : 'bg-[#151719] text-gray-400 border-[#2a2c31] hover:text-white hover:border-gray-500'}`}>
                            {genre.name}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* --- MANGA GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {mangaList.map(item => (
                <Link to={`/manga/${item.mal_id}`} key={item.mal_id} className="group cursor-pointer">
                    <div className="overflow-hidden rounded-lg aspect-[3/4] mb-3 relative">
                        <img src={item.images.jpg.large_image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <div className="absolute top-2 left-2 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">{item.type}</div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1"><FaStar className="text-yellow-400 text-[8px]" /> {item.score}</div>
                    </div>
                    <h3 className="font-bold text-sm text-gray-200 group-hover:text-hianime-accent truncate transition">{item.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1"><span>{item.status}</span><span>•</span><span>{item.volumes || '?'} Vols</span></div>
                </Link>
            ))}
        </div>
        
        {!loading && mangaList.length === 0 && (
            <div className="text-center text-gray-500 py-20">No manga found.</div>
        )}

        {/* --- PAGINATION COMPONENT --- */}
        {mangaList.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-12 animate-fade-in">
                {/* First & Prev */}
                <button onClick={() => handlePageChange(1)} disabled={page === 1} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#202225] text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition"><FaAngleDoubleLeft /></button>
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#202225] text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition"><FaAngleLeft /></button>
                
                {/* Page Numbers */}
                <div className="flex gap-2">
                    {[page - 2, page - 1, page, page + 1, page + 2].map(p => {
                        // Logic to hide pages that don't exist
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

                {/* Next & Last */}
                <button onClick={() => handlePageChange(page + 1)} disabled={!pagination.has_next_page} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#202225] text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition"><FaAngleRight /></button>
                <button onClick={() => handlePageChange(pagination.last_visible_page || page + 1)} disabled={!pagination.has_next_page} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#202225] text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition"><FaAngleDoubleRight /></button>
            </div>
        )}
    </div>
  );
};

export default Manga;