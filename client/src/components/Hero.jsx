import React, { useState, useEffect } from 'react';
import { FaPlayCircle, FaCalendarAlt, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Hero = ({ animes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, [currentIndex, animes]);

  if (!animes || animes.length === 0) return null;

  const anime = animes[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % animes.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + animes.length) % animes.length);
  };

  return (
    <div className="relative h-[65vh] w-full mt-14 overflow-hidden group">
      
      {/* Background Image */}
      <div 
        key={anime.mal_id} // Key forces re-render for animation
        className="absolute inset-0 bg-cover bg-center blur-sm opacity-50 scale-105 animate-fade-in transition-all duration-700"
        style={{ backgroundImage: `url(${anime.images.jpg.large_image_url})` }}
      ></div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-hianime-dark via-hianime-dark/80 to-transparent"></div>

      {/* Navigation Arrows */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 z-20 bg-black/50 p-3 rounded-full text-white hover:bg-hianime-accent hover:text-black transition">
        <FaChevronLeft />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 z-20 bg-black/50 p-3 rounded-full text-white hover:bg-hianime-accent hover:text-black transition">
        <FaChevronRight />
      </button>

      {/* Content */}
      <div className="relative z-10 flex items-end h-full max-w-[1400px] mx-auto px-6 pb-12 gap-8">
        <img 
          src={anime.images.jpg.large_image_url} 
          alt={anime.title} 
          className="hidden lg:block w-48 rounded-lg shadow-2xl transition-transform duration-500 transform hover:scale-105"
        />

        <div className="mb-2 flex-1 animate-slide-up">
            <div className="text-hianime-accent font-bold mb-2 tracking-wide text-sm">
                #{currentIndex + 1} Spotlight
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-none truncate">
                {anime.title}
            </h1>

            <div className="flex items-center gap-4 text-gray-300 text-xs mb-4">
                <span className="flex items-center gap-1"><FaPlayCircle /> {anime.type}</span>
                <span className="flex items-center gap-1"><FaClock /> {anime.duration}</span>
                <span className="flex items-center gap-1"><FaCalendarAlt /> {anime.year || 'N/A'}</span>
                <span className="bg-hianime-accent text-black px-1.5 rounded font-bold">HD</span>
            </div>

            <p className="text-gray-400 line-clamp-3 max-w-2xl mb-6 text-sm">
                {anime.synopsis}
            </p>

            <div className="flex gap-3">
                <Link to={`/anime/${anime.mal_id}`} className="bg-hianime-accent text-hianime-dark px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-pink-300 transition shadow-[0_0_15px_rgba(255,186,222,0.4)]">
                    <FaPlayCircle /> Watch Now
                </Link>
                <Link to={`/anime/${anime.mal_id}`} className="bg-gray-800 text-white px-6 py-2.5 rounded-full font-bold hover:bg-gray-700 transition">
                    Detail <span className="ml-1">›</span>
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;