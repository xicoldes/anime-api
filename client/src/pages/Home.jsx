import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Trending from '../components/Trending';
import { api } from '../services/api';

const Home = () => {
  // Initialize spotlight as an empty array [] so the slider logic works immediately
  const [spotlight, setSpotlight] = useState([]); 
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get Spotlight Data (Now returns an Array of top 10 animes)
        const spotlightData = await api.anime.getSpotlight();
        setSpotlight(spotlightData);

        // 2. Get Trending List
        const trendingData = await api.top.getAnime();
        setTrending(trendingData.data.data);

        // 3. Get Latest/Season Data
        const seasonData = await api.seasons.getNow();
        setLatest(seasonData.data.data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Pass the full array to Hero. Only show if we have data. */}
      {spotlight.length > 0 ? (
        <Hero animes={spotlight} />
      ) : (
        <div className="h-96 flex items-center justify-center text-hianime-accent">
          Loading Spotlight...
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Content: Latest Episodes */}
        <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-hianime-accent mb-6">Latest Episodes</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {latest.slice(0, 12).map(anime => (
                    <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id} className="group relative cursor-pointer">
                        <div className="overflow-hidden rounded-lg aspect-[3/4] mb-2 relative">
                            <img 
                                src={anime.images.jpg.large_image_url} 
                                alt={anime.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                            />
                            <div className="absolute top-2 left-2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                Ep {anime.episodes || '?'}
                            </div>
                        </div>
                        <h3 className="font-bold text-sm text-gray-200 group-hover:text-hianime-accent truncate transition">
                            {anime.title}
                        </h3>
                    </Link>
                ))}
            </div>
        </div>

        {/* Sidebar: Trending */}
        <div className="lg:col-span-1">
            <Trending animes={trending} />
        </div>

      </div>
    </div>
  );
};

export default Home;