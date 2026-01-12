import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Trending from '../components/Trending';
import { api } from '../services/api';
import { FaFilm, FaChevronRight } from 'react-icons/fa';

const Home = () => {
  const [spotlight, setSpotlight] = useState([]); 
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [movies, setMovies] = useState([]); 
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dataFetched = useRef(false);

  // 1. Redirect filters to the dedicated pages
  useEffect(() => {
      const genreParam = searchParams.get('genre');
      const typeParam = searchParams.get('type');
      const viewParam = searchParams.get('view');

      // If URL has genre or view=all, redirect to /anime (or /movies if specified)
      if (genreParam || viewParam === 'all') {
          if (typeParam === 'movie') {
              navigate(`/movies?${searchParams.toString()}`);
          } else {
              navigate(`/anime?${searchParams.toString()}`);
          }
      }
  }, [searchParams, navigate]);

  // 2. Fetch Dashboard Data
  useEffect(() => {
    if (dataFetched.current) return;
    dataFetched.current = true;

    const fetchData = async () => {
        try {
            const spotlightData = await api.anime.getSpotlight();
            setSpotlight(spotlightData);
            
            const trendingData = await api.anime.getTrending();
            setTrending(trendingData); 
            
        } catch (err) { console.error("Initial Load Error", err); }

        setTimeout(async () => {
            try {
                const latestData = await api.seasons.getNow();
                setLatest(latestData.data.data);
            } catch (err) { console.error("Latest Error", err); }
        }, 600);

        setTimeout(async () => {
            try {
                const movieData = await api.movies.getTop();
                setMovies(movieData.data.data);
            } catch (err) { console.error("Movie Load Error", err); }
        }, 1200);
    };
    fetchData();
  }, []);

  return (
    <div>
      {spotlight.length > 0 && <Hero animes={spotlight} />}

      <div className="max-w-[1400px] mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-3">
            
            {/* --- LATEST EPISODES SECTION --- */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-hianime-accent">Latest Episodes</h2>
                
                {/* DIRECT LINK TO DEDICATED PAGE */}
                <Link to="/anime" className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1 transition">
                    View All <FaChevronRight size={10} />
                </Link>
            </div>

            {/* RESULTS GRID (Top 12 Only) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
                {latest.slice(0, 12).map(anime => (
                    <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id} className="group relative cursor-pointer">
                        <div className="overflow-hidden rounded-lg aspect-[3/4] mb-2 relative">
                            <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                            <div className="absolute top-2 left-2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm">{anime.score ? `★ ${anime.score}` : 'Ep ?'}</div>
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-center items-center p-4 text-center">
                                <span className="text-hianime-accent text-sm font-bold mb-2">View Details</span>
                                <span className="text-xs text-gray-300">{anime.type} • {anime.year || 'N/A'}</span>
                            </div>
                        </div>
                        <h3 className="font-bold text-sm text-gray-200 group-hover:text-hianime-accent truncate transition">{anime.title_english || anime.title}</h3>
                    </Link>
                ))}
            </div>

            {/* --- MOVIES SECTION --- */}
            {movies.length > 0 && (
                <div className="animate-slide-up">
                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                        <h2 className="text-xl font-bold text-hianime-accent flex items-center gap-2"><FaFilm /> Popular Movies</h2>
                        <Link to="/movies" className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1 transition">View All <FaChevronRight size={10} /></Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {movies.slice(0, 8).map(movie => (
                            <Link to={`/anime/${movie.mal_id}`} key={movie.mal_id} className="group relative cursor-pointer">
                                <div className="overflow-hidden rounded-lg aspect-[3/4] mb-2 relative">
                                    <img src={movie.images.jpg.large_image_url} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                    <div className="absolute top-2 left-2 bg-hianime-accent text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm">MOVIE</div>
                                </div>
                                <h3 className="font-bold text-sm text-gray-200 group-hover:text-hianime-accent truncate transition">{movie.title_english || movie.title}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="lg:col-span-1 self-start">
            <Trending animes={trending} />
        </div>

      </div>
    </div>
  );
};

export default Home;