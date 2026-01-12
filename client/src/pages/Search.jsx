import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlayCircle, FaSearch, FaClock } from 'react-icons/fa';
import { BANNED_IDS } from '../utils/banned'; 

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('keyword') || searchParams.get('q'); 
  const type = searchParams.get('type'); // 1. GET TYPE FROM URL
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const performSearch = async () => {
        setLoading(true);
        try {
            await new Promise(r => setTimeout(r, 300));

            // 2. CONSTRUCT URL WITH TYPE
            let url = `https://api.jikan.moe/v4/anime?q=${query}&sfw=true&order_by=members&sort=desc`;
            
            // If type is "movie", append it to the API URL
            if (type === 'movie') {
                url += `&type=movie`;
            }

            const res = await axios.get(url);
            
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
  }, [query, type]); // 3. ADD TYPE TO DEPENDENCIES

  return (
    <div className="pt-24 min-h-screen max-w-[1400px] mx-auto px-4 pb-20">
        <h1 className="text-2xl font-bold text-white mb-6 border-l-4 border-hianime-accent pl-4 flex items-center gap-2">
            <FaSearch /> Search Results for: <span className="text-hianime-accent">"{query}"</span>
            {type === 'movie' && <span className="text-xs bg-hianime-accent text-black px-2 py-1 rounded ml-2">MOVIES</span>}
        </h1>

        {loading ? (
            <div className="text-center text-hianime-accent font-bold mt-20">Searching...</div>
        ) : (
            <>
                {results.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {results.map(anime => (
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
                ) : (
                    <div className="text-center text-gray-500 mt-20">No results found.</div>
                )}
            </>
        )}
    </div>
  );
};

export default Search;