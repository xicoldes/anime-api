import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { FaStar, FaClock, FaFilm } from 'react-icons/fa';

const Movies = () => {
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
        try {
            const res = await api.movies.getTop();
            setMovieList(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchMovies();
  }, []);

  if (loading) return <div className="min-h-screen pt-32 text-center text-hianime-accent">Loading Movies...</div>;

  return (
    <div className="pt-24 min-h-screen max-w-[1400px] mx-auto px-6 pb-20">
        <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-hianime-accent pl-4 flex items-center gap-3">
            <FaFilm /> Top Anime Movies
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movieList.map(movie => (
                <Link to={`/anime/${movie.mal_id}`} key={movie.mal_id} className="group cursor-pointer">
                    <div className="overflow-hidden rounded-lg aspect-[3/4] mb-3 relative">
                        <img 
                            src={movie.images.jpg.large_image_url} 
                            alt={movie.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                        />
                        <div className="absolute top-2 left-2 bg-hianime-accent text-black text-[10px] font-bold px-2 py-0.5 rounded-sm">
                            #{movie.rank}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <FaStar className="text-yellow-400 text-[8px]" /> {movie.score}
                        </div>
                    </div>
                    
                    <h3 className="font-bold text-sm text-gray-200 group-hover:text-hianime-accent truncate transition">
                        {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><FaClock className="text-[10px]"/> {movie.duration}</span>
                        <span>•</span>
                        <span>{movie.year || 'N/A'}</span>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  );
};

export default Movies;