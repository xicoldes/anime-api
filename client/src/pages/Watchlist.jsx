import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem('user') || 'guest';

  useEffect(() => {
    const fetchWatchlist = async () => {
      // 1. Get IDs from local storage based on user
      const savedIDs = JSON.parse(localStorage.getItem(`watchlist_${user}`)) || [];
      
      if (savedIDs.length === 0) {
          setLoading(false);
          return;
      }

      // 2. Fetch details for each ID
      // Note: We fetch sequentially to avoid hitting API rate limits
      const animeData = [];
      for (const id of savedIDs) {
          try {
              const res = await api.anime.getFull(id);
              animeData.push(res.data.data);
              // Small delay to be polite to the API
              await new Promise(r => setTimeout(r, 300)); 
          } catch (err) {
              console.error(`Could not fetch anime ${id}`, err);
          }
      }
      setWatchlist(animeData);
      setLoading(false);
    };

    fetchWatchlist();
  }, [user]);

  return (
    <div className="pt-24 min-h-screen max-w-[1400px] mx-auto px-6">
        <h2 className="text-3xl font-bold mb-2">My Watchlist</h2>
        <p className="text-gray-400 mb-8">
            Logged in as: <span className="text-hianime-accent font-bold capitalize">{user}</span>
        </p>

        {loading ? (
            <div className="text-center text-gray-500">Loading your list...</div>
        ) : watchlist.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
                You haven't added anything to your watchlist yet!
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {watchlist.map(anime => (
                    <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id} className="group cursor-pointer">
                        <div className="overflow-hidden rounded-lg aspect-[3/4] mb-3 relative">
                            <img 
                                src={anime.images.jpg.large_image_url} 
                                alt={anime.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                            />
                            <div className="absolute top-2 left-2 bg-hianime-accent text-black text-[10px] font-bold px-2 py-0.5 rounded-sm">
                                {anime.score || '?'}
                            </div>
                        </div>
                        <h3 className="font-bold text-sm text-gray-200 group-hover:text-hianime-accent truncate transition">
                            {anime.title}
                        </h3>
                        <p className="text-xs text-gray-500">{anime.type} • {anime.episodes || '?'} eps</p>
                    </Link>
                ))}
            </div>
        )}
    </div>
  );
};

export default Watchlist;