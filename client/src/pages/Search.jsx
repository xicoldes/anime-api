import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlayCircle, FaSearch, FaClock, FaBook } from 'react-icons/fa'; 
import { BANNED_IDS } from '../utils/banned'; 

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('keyword') || searchParams.get('q'); 
  const type = searchParams.get('type'); // Get 'manga', 'movie', or 'tv'
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to know if we are in Manga mode
  const isManga = type === 'manga';

  useEffect(() => {
    if (!query) return;

    const performSearch = async () => {
        setLoading(true);
        try {
            await new Promise(r => setTimeout(r, 300));

            // 1. DYNAMIC BASE URL
            let baseUrl = isManga 
                ? `https://api.jikan.moe/v4/manga?q=${query}&sfw=true&order_by=members&sort=desc`
                : `https://api.jikan.moe/v4/anime?q=${query}&sfw=true&order_by=members&sort=desc`;
            
            // 2. APPEND SPECIFIC FILTERS
            if (type === 'movie') {
                baseUrl += `&type=movie`;
            } 
            // --- NEW FIX: HANDLE 'TV' TYPE ---
            else if (type === 'tv') {
                baseUrl += `&type=tv`;
            }

            const res = await axios.get(baseUrl);
            
            if (res.data.data) {
                // Apply Ban Filter
                const cleanData = res.data.data.filter(item => {
                    return !BANNED_IDS.some(id => String(id) === String(item.mal_id));
                });
                setResults(cleanData);
            }
        } catch (err) {
            console.error("Search error", err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    performSearch();
  }, [query, type, isManga]);

  // Helper to display the correct label badge
  const getBadge = () => {
      if (type === 'movie') return <span className="text-xs bg-hianime-accent text-black px-2 py-1 rounded ml-2">MOVIES</span>;
      if (type === 'manga') return <span className="text-xs bg-white text-black px-2 py-1 rounded ml-2">MANGA</span>;
      if (type === 'tv') return <span className="text-xs bg-hianime-accent text-black px-2 py-1 rounded ml-2">ANIME</span>;
      return null;
  };

  return (
    <div className="pt-24 min-h-screen max-w-[1400px] mx-auto px-4 pb-20">
        <h1 className="text-2xl font-bold text-white mb-6 border-l-4 border-hianime-accent pl-4 flex items-center gap-2">
            <FaSearch /> Search Results for: <span className="text-hianime-accent">"{query}"</span>
            {getBadge()}
        </h1>

        {loading ? (
            <div className="text-center text-hianime-accent font-bold mt-20">Searching...</div>
        ) : (
            <>
                {results.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {results.map(item => (
                            <Link 
                                to={`/${isManga ? 'manga' : 'anime'}/${item.mal_id}`} 
                                key={item.mal_id} 
                                className="group cursor-pointer"
                            >
                                <div className="overflow-hidden rounded-lg aspect-[3/4] mb-3 relative">
                                    <img src={item.images.jpg.large_image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                    <div className="absolute top-2 left-2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                        {item.score ? `★ ${item.score}` : '?'}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                                        {isManga ? <FaBook className="text-white text-4xl drop-shadow-lg"/> : <FaPlayCircle className="text-white text-4xl drop-shadow-lg" />}
                                    </div>
                                </div>
                                <h3 className="font-bold text-sm text-gray-200 group-hover:text-hianime-accent truncate transition">
                                    {item.title_english || item.title}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <span className="flex items-center gap-1">
                                        <FaClock className="text-[10px]"/> 
                                        {isManga ? (item.chapters ? `${item.chapters} Ch` : 'Ongoing') : (item.year || 'N/A')}
                                    </span>
                                    <span>•</span>
                                    <span>{item.type}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-20">No results found.</div>
                )}
            </>
        )}
    </div>
  );
};

export default Search;