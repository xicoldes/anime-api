import React, { useEffect, useState, useRef } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { FaStar, FaBookOpen, FaFilter, FaTimes, FaRedo } from 'react-icons/fa';

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
  const dataFetched = useRef(false);

  useEffect(() => {
    if (dataFetched.current) return;
    dataFetched.current = true;

    const fetchInitialData = async () => {
        try {
            // 1. Get Top Manga
            const res = await api.manga.getTop();
            setMangaList(res.data.data);

            // 2. Get Genres and Filter them
            const genreRes = await api.manga.getGenres();
            const safeGenres = genreRes.data.data
                .filter(g => ALLOWED_GENRES.includes(g.name))
                .sort((a, b) => a.name.localeCompare(b.name));
            setGenres(safeGenres);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchInitialData();
  }, []);

  const handleGenreClick = async (genreId) => {
      setLoading(true);
      setSelectedGenre(genreId);
      try {
          // Search Manga by Genre, sorted by Popularity (Members)
          const res = await api.manga.search('', genreId, 'members');
          setMangaList(res.data.data);
      } catch (err) {
          console.error(err);
      } finally {
          setLoading(false);
      }
  };

  const resetView = async () => {
      setLoading(true);
      setSelectedGenre(null);
      setShowFilter(false);
      try {
          const res = await api.manga.getTop();
          setMangaList(res.data.data);
      } catch (err) {
          console.error(err);
      } finally {
          setLoading(false);
      }
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
                
                {/* Reset Button */}
                {selectedGenre && (
                    <button onClick={resetView} className="text-xs text-red-400 hover:text-white flex items-center gap-1 bg-black/20 px-2 py-1 rounded border border-white/5 transition">
                        <FaRedo size={10} /> Reset
                    </button>
                )}
            </div>

            {/* Filter Toggle */}
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

        {/* --- MANGA GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {mangaList.map(item => (
                <Link to={`/manga/${item.mal_id}`} key={item.mal_id} className="group cursor-pointer">
                    <div className="overflow-hidden rounded-lg aspect-[3/4] mb-3 relative">
                        <img 
                            src={item.images.jpg.large_image_url} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                        />
                        <div className="absolute top-2 left-2 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">
                            {item.type}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <FaStar className="text-yellow-400 text-[8px]" /> {item.score}
                        </div>
                    </div>
                    
                    <h3 className="font-bold text-sm text-gray-200 group-hover:text-hianime-accent truncate transition">
                        {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>{item.status}</span>
                        <span>•</span>
                        <span>{item.volumes || '?'} Vols</span>
                    </div>
                </Link>
            ))}
        </div>
        
        {!loading && mangaList.length === 0 && (
            <div className="text-center text-gray-500 py-20">No manga found.</div>
        )}
    </div>
  );
};

export default Manga;