import React, { useState, useEffect } from 'react';
import { FaPlayCircle, FaCalendarAlt, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Hero = ({ animes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, animes]);

  if (!animes || animes.length === 0) return null;

  const anime = animes[currentIndex];

  const bgImage = anime.trailer?.images?.maximum_image_url || 
                  anime.trailer?.images?.large_image_url || 
                  anime.images.jpg.large_image_url;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % animes.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + animes.length) % animes.length);
  };

  return (
    <div className="relative h-[45vh] md:h-[55vh] w-full mt-16 bg-hianime-dark overflow-hidden group">
      
      {/* 1. IMAGE LAYER - The "Red Box" Area */}
      <div className="absolute top-0 right-0 w-full md:w-[70%] h-full z-0">
        <img 
            key={anime.mal_id}
            src={bgImage} 
            alt={anime.title}
            // KEY FIX: 'object-contain' ensures the WHOLE image shows (no crop).
            // 'object-right' pushes it to the right side.
            className="w-full h-full object-contain object-right animate-fade-in"
            style={{
                // Soft gradient mask to blend the left side into the background
                maskImage: 'linear-gradient(to right, transparent 0%, black 20%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%)'
            }}
        />
      </div>

      {/* Navigation Arrows */}
      <div className="hidden md:block">
          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/5 border border-white/10 p-2 rounded-full text-white hover:bg-hianime-accent hover:text-black transition backdrop-blur-md">
            <FaChevronLeft size={14} />
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/5 border border-white/10 p-2 rounded-full text-white hover:bg-hianime-accent hover:text-black transition backdrop-blur-md">
            <FaChevronRight size={14} />
          </button>
      </div>

      {/* 2. CONTENT LAYER - Left Side */}
      <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
            
            {/* Text Container */}
            <div className="w-full md:w-[50%] animate-slide-up">
                
                <div className="text-hianime-accent font-bold mb-2 tracking-widest text-[10px] md:text-xs uppercase flex items-center gap-2">
                    <span className="text-hianime-accent font-black">#{currentIndex + 1} Spotlight</span>
                </div>

                <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight tracking-tight drop-shadow-lg line-clamp-2">
                    {anime.title}
                </h1>

                <div className="flex items-center gap-3 text-gray-300 text-[10px] md:text-xs mb-4 font-medium">
                    <span className="flex items-center gap-1.5">
                        <FaPlayCircle className="text-hianime-accent"/> {anime.type}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <FaClock className="text-hianime-accent"/> {anime.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-hianime-accent"/> {anime.year || '2024'}
                    </span>
                    <span className="bg-hianime-accent text-black px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">
                        HD
                    </span>
                </div>

                <p className="text-gray-400 line-clamp-3 text-xs md:text-sm mb-6 leading-relaxed max-w-lg font-medium">
                    {anime.synopsis}
                </p>

                <div className="flex gap-3">
                    <Link 
                        to={`/anime/${anime.mal_id}`} 
                        className="bg-hianime-accent text-black px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-white transition shadow-[0_0_15px_rgba(56,189,248,0.3)] text-sm"
                    >
                        <FaPlayCircle /> Watch Now
                    </Link>
                    <Link 
                        to={`/anime/${anime.mal_id}`} 
                        className="bg-white/5 border border-white/10 text-white px-6 py-2.5 rounded-full font-bold hover:bg-white/10 transition backdrop-blur-sm text-sm"
                    >
                        Detail <span className="ml-1">›</span>
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;