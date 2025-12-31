import React, { useState, useEffect } from 'react';
import { FaPlayCircle, FaCalendarAlt, FaClock, FaChevronLeft, FaChevronRight, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Hero = ({ animes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, animes]);

  if (!animes || animes.length === 0) return null;

  const anime = animes[currentIndex];

  // LOGIC: Try to find a landscape trailer image first. 
  // If not available, fallback to the large poster.
  const getBackground = (anime) => {
      return anime.trailer?.images?.maximum_image_url || 
             anime.trailer?.images?.large_image_url || 
             anime.trailer?.images?.medium_image_url || 
             anime.images.jpg.large_image_url;
  };
  
  const bgImage = getBackground(anime);
  // Check if we fell back to a poster (vertical image) so we can blur it
  const isPoster = bgImage === anime.images.jpg.large_image_url;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % animes.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + animes.length) % animes.length);
  };

  return (
    <div className="relative h-[65vh] w-full mt-14 overflow-hidden group">
      
      {/* Background Image Layer */}
      <div 
        key={anime.mal_id} 
        className={`absolute inset-0 bg-cover bg-center transition-all duration-700 animate-fade-in ${
            isPoster ? "blur-md opacity-40 scale-110" : "opacity-70 scale-105"
        }`}
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      
      {/* Gradient Overlay for Readability (Slate/Blue Theme) */}
      <div className="absolute inset-0 bg-gradient-to-t from-hianime-dark via-hianime-dark/80 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-hianime-dark/95 via-hianime-dark/40 to-transparent"></div>

      {/* Navigation Arrows */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 z-20 bg-black/40 border border-white/10 p-3 rounded-full text-white hover:bg-hianime-accent hover:text-black transition backdrop-blur-sm">
        <FaChevronLeft />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 z-20 bg-black/40 border border-white/10 p-3 rounded-full text-white hover:bg-hianime-accent hover:text-black transition backdrop-blur-sm">
        <FaChevronRight />
      </button>

      {/* Main Content */}
      <div className="relative z-10 flex items-end h-full max-w-[1400px] mx-auto px-6 pb-12 gap-10">
        {/* Poster Image (Hidden on mobile) */}
        <img 
          src={anime.images.jpg.large_image_url} 
          alt={anime.title} 
          className="hidden lg:block w-52 rounded-lg shadow-2xl transition-transform duration-500 transform hover:scale-105 border-4 border-hianime-sidebar"
        />

        <div className="mb-2 flex-1 animate-slide-up">
            {/* Spotlight Tag */}
            <div className="text-hianime-accent font-bold mb-3 tracking-wide text-sm uppercase flex items-center gap-2">
                <span className="w-8 h-[2px] bg-hianime-accent inline-block"></span>
                #{currentIndex + 1} Spotlight
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-none truncate drop-shadow-lg">
                {anime.title}
            </h1>

            {/* Meta Data Icons */}
            <div className="flex items-center gap-4 text-gray-300 text-xs mb-5 font-bold">
                <span className="flex items-center gap-1 bg-white text-black px-2 py-0.5 rounded uppercase shadow-sm">
                    {anime.type}
                </span>
                <span className="flex items-center gap-1">
                    <FaClock className="text-hianime-accent"/> {anime.duration}
                </span>
                <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-hianime-accent"/> {anime.year || 'N/A'}
                </span>
                <span className="bg-hianime-accent text-hianime-dark px-1.5 rounded font-extrabold">HD</span>
            </div>

            {/* Synopsis */}
            <p className="text-gray-300 line-clamp-3 max-w-2xl mb-8 text-sm leading-relaxed drop-shadow-md">
                {anime.synopsis}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Link 
                    to={`/anime/${anime.mal_id}`} 
                    className="bg-hianime-accent text-hianime-dark px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                >
                     View Details <span className="ml-1">›</span>
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;