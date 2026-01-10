import React, { useEffect, useState, useRef } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { 
    FaPlayCircle, FaBookOpen, FaTrash, 
    FaChevronLeft, FaChevronRight, 
    FaAngleDoubleLeft, FaAngleDoubleRight 
} from 'react-icons/fa';

const Watchlist = () => {
  const [animeList, setAnimeList] = useState([]);
  const [mangaList, setMangaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem('user');

  // Refs for scrolling
  const animeScrollRef = useRef(null);
  const mangaScrollRef = useRef(null);

  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    }

    const fetchData = async () => {
        try {
            // 1. Fetch Anime List
            const animeIds = JSON.parse(localStorage.getItem(`watchlist_${user}`)) || [];
            if (animeIds.length > 0) {
                const animePromises = animeIds.map(id => api.anime.getFull(id).catch(e => null));
                const animeResponses = await Promise.all(animePromises);
                setAnimeList(animeResponses.filter(res => res !== null).map(res => res.data.data));
            }

            // 2. Fetch Manga List
            const mangaIds = JSON.parse(localStorage.getItem(`mangalists_${user}`)) || [];
            if (mangaIds.length > 0) {
                const mangaPromises = mangaIds.map(id => api.manga.getDetails(id).catch(e => null));
                const mangaResponses = await Promise.all(mangaPromises);
                setMangaList(mangaResponses.filter(res => res !== null).map(res => res.data.data));
            }
        } catch (error) {
            console.error("Error fetching watchlist:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [user]);

  // Remove Handler
  const removeFromList = (id, type) => {
      const storageKey = type === 'anime' ? `watchlist_${user}` : `mangalists_${user}`;
      const currentList = JSON.parse(localStorage.getItem(storageKey)) || [];
      const newList = currentList.filter(itemId => itemId !== String(id));
      localStorage.setItem(storageKey, JSON.stringify(newList));
      
      if (type === 'anime') {
          setAnimeList(prev => prev.filter(item => item.mal_id !== id));
      } else {
          setMangaList(prev => prev.filter(item => item.mal_id !== id));
      }
  };

  // UPDATED: Scroll Handler with Start/End Logic
  const scroll = (ref, direction) => {
      if (ref.current) {
          const { current } = ref;
          if (direction === 'start') {
              current.scrollTo({ left: 0, behavior: 'smooth' });
          } else if (direction === 'end') {
              current.scrollTo({ left: current.scrollWidth, behavior: 'smooth' });
          } else {
              const scrollAmount = direction === 'left' ? -500 : 500;
              current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
      }
  };

  if (!user) return (
      <div className="min-h-screen pt-32 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Please Login to view your collections</h2>
          <Link to="/login" className="text-hianime-accent hover:underline">Go to Login</Link>
      </div>
  );

  if (loading) return <div className="min-h-screen pt-32 text-center text-hianime-accent font-bold text-xl">Loading Collections...</div>;

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-[1400px] mx-auto px-6">
        <h1 className="text-3xl font-bold text-white mb-10 border-l-4 border-hianime-accent pl-4">My Collections</h1>

        {/* --- ANIME SECTION --- */}
        <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-hianime-accent flex items-center gap-2">
                    <FaPlayCircle /> Anime Watchlist <span className="text-xs text-gray-500 bg-white/10 px-2 py-0.5 rounded-full ml-2">{animeList.length}</span>
                </h2>
                
                {/* Scroll Buttons */}
                {animeList.length > 5 && (
                    <div className="flex gap-2">
                        <button onClick={() => scroll(animeScrollRef, 'start')} className="p-2 rounded-full bg-hianime-sidebar hover:bg-hianime-accent hover:text-black transition border border-white/10" title="Jump to Start"><FaAngleDoubleLeft /></button>
                        <button onClick={() => scroll(animeScrollRef, 'left')} className="p-2 rounded-full bg-hianime-sidebar hover:bg-hianime-accent hover:text-black transition border border-white/10" title="Scroll Left"><FaChevronLeft /></button>
                        <button onClick={() => scroll(animeScrollRef, 'right')} className="p-2 rounded-full bg-hianime-sidebar hover:bg-hianime-accent hover:text-black transition border border-white/10" title="Scroll Right"><FaChevronRight /></button>
                        <button onClick={() => scroll(animeScrollRef, 'end')} className="p-2 rounded-full bg-hianime-sidebar hover:bg-hianime-accent hover:text-black transition border border-white/10" title="Jump to End"><FaAngleDoubleRight /></button>
                    </div>
                )}
            </div>

            {animeList.length > 0 ? (
                <div 
                    ref={animeScrollRef}
                    className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-hianime-accent scrollbar-track-hianime-sidebar snap-x"
                >
                    {animeList.map(anime => (
                        <div key={anime.mal_id} className="min-w-[160px] md:min-w-[200px] snap-start relative group">
                            <Link to={`/anime/${anime.mal_id}`}>
                                <div className="h-[280px] rounded-lg overflow-hidden mb-3 border border-white/5 relative">
                                    <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                    <div className="absolute top-2 left-2 bg-hianime-accent text-black text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                                        {anime.type}
                                    </div>
                                </div>
                                <h3 className="text-white font-bold text-sm truncate group-hover:text-hianime-accent transition">
                                    {anime.title_english || anime.title}
                                </h3>
                                <p className="text-gray-500 text-xs">{anime.episodes || '?'} Eps</p>
                            </Link>
                            <button 
                                onClick={() => removeFromList(anime.mal_id, 'anime')}
                                className="absolute top-2 right-2 bg-black/60 text-red-400 p-1.5 rounded hover:bg-red-500 hover:text-white transition opacity-0 group-hover:opacity-100"
                                title="Remove from list"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-gray-500 italic bg-hianime-sidebar p-8 rounded-xl border border-white/5 text-center">Your anime watchlist is empty.</div>
            )}
        </div>

        {/* --- MANGA SECTION --- */}
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-hianime-accent flex items-center gap-2">
                    <FaBookOpen /> Manga Collection <span className="text-xs text-gray-500 bg-white/10 px-2 py-0.5 rounded-full ml-2">{mangaList.length}</span>
                </h2>
                
                {/* Scroll Buttons */}
                {mangaList.length > 5 && (
                    <div className="flex gap-2">
                        <button onClick={() => scroll(mangaScrollRef, 'start')} className="p-2 rounded-full bg-hianime-sidebar hover:bg-hianime-accent hover:text-black transition border border-white/10" title="Jump to Start"><FaAngleDoubleLeft /></button>
                        <button onClick={() => scroll(mangaScrollRef, 'left')} className="p-2 rounded-full bg-hianime-sidebar hover:bg-hianime-accent hover:text-black transition border border-white/10" title="Scroll Left"><FaChevronLeft /></button>
                        <button onClick={() => scroll(mangaScrollRef, 'right')} className="p-2 rounded-full bg-hianime-sidebar hover:bg-hianime-accent hover:text-black transition border border-white/10" title="Scroll Right"><FaChevronRight /></button>
                        <button onClick={() => scroll(mangaScrollRef, 'end')} className="p-2 rounded-full bg-hianime-sidebar hover:bg-hianime-accent hover:text-black transition border border-white/10" title="Jump to End"><FaAngleDoubleRight /></button>
                    </div>
                )}
            </div>

            {mangaList.length > 0 ? (
                <div 
                    ref={mangaScrollRef}
                    className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-hianime-accent scrollbar-track-hianime-sidebar snap-x"
                >
                    {mangaList.map(manga => (
                        <div key={manga.mal_id} className="min-w-[160px] md:min-w-[200px] snap-start relative group">
                            <Link to={`/manga/${manga.mal_id}`}>
                                <div className="h-[280px] rounded-lg overflow-hidden mb-3 border border-white/5 relative">
                                    <img src={manga.images.jpg.large_image_url} alt={manga.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                    <div className="absolute top-2 left-2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                                        {manga.type}
                                    </div>
                                </div>
                                <h3 className="text-white font-bold text-sm truncate group-hover:text-hianime-accent transition">
                                    {manga.title_english || manga.title}
                                </h3>
                                <p className="text-gray-500 text-xs">{manga.volumes || '?'} Vols</p>
                            </Link>
                            <button 
                                onClick={() => removeFromList(manga.mal_id, 'manga')}
                                className="absolute top-2 right-2 bg-black/60 text-red-400 p-1.5 rounded hover:bg-red-500 hover:text-white transition opacity-0 group-hover:opacity-100"
                                title="Remove from collection"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-gray-500 italic bg-hianime-sidebar p-8 rounded-xl border border-white/5 text-center">Your manga collection is empty.</div>
            )}
        </div>
    </div>
  );
};

export default Watchlist;