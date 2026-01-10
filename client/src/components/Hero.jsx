import React, { useState, useEffect } from 'react';
import { FaPlayCircle, FaCalendarAlt, FaClock, FaChevronLeft, FaChevronRight, FaPlay } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Hero = ({ animes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const goToSlide = (index) => {
      setCurrentIndex(index);
  };

  const minSwipeDistance = 50; 

  const onTouchStart = (e) => {
    setTouchEnd(null); 
    setTouchStart(e.targetTouches ? e.targetTouches[0].clientX : e.clientX);
    setIsDragging(true);
  };

  const onTouchMove = (e) => {
      if (!isDragging) return;
      setTouchEnd(e.targetTouches ? e.targetTouches[0].clientX : e.clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    setIsDragging(false);
  };

  return (
    <div 
        className="relative h-[50vh] md:h-[55vh] w-full mt-16 bg-hianime-dark overflow-hidden group select-none cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onTouchStart}
        onMouseMove={onTouchMove}
        onMouseUp={onTouchEnd}
        onMouseLeave={() => setIsDragging(false)}
    >
      
      {/* 1. IMAGE LAYER */}
      <div className="absolute top-0 right-0 w-full h-full md:w-[70%] z-0 pointer-events-none">
        
        {/* Mobile Gradient (Bottom to Top) - Kept for mobile text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#202225] via-transparent to-transparent md:hidden z-10" />
        
        {/* FIXED: Removed the desktop overlay gradient that caused the "dark patch" */}
        
        <img 
            key={anime.mal_id}
            src={bgImage} 
            alt={anime.title}
            className="w-full h-full object-cover md:object-contain md:object-right animate-fade-in"
            // FIXED: Using Mask Image creates a clean fade without darkening the image
            style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 50%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 50%)'
            }}
        />
      </div>

      {/* Navigation Arrows */}
      <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/5 border border-white/10 p-2 rounded-full text-white hover:bg-hianime-accent hover:text-black transition backdrop-blur-md">
            <FaChevronLeft size={14} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/5 border border-white/10 p-2 rounded-full text-white hover:bg-hianime-accent hover:text-black transition backdrop-blur-md">
            <FaChevronRight size={14} />
          </button>
      </div>

      {/* 2. CONTENT LAYER */}
      <div className="absolute top-0 left-0 w-full h-full z-20 flex items-end md:items-center pb-12 md:pb-0 pointer-events-none">
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 w-full">
            <div className="w-full md:w-[50%] animate-slide-up pointer-events-auto">
                <div className="text-hianime-accent font-bold mb-2 tracking-widest text-[10px] md:text-xs uppercase flex items-center gap-2">
                    <span className="text-hianime-accent font-black">#{currentIndex + 1} Spotlight</span>
                </div>
                
                <h1 className="text-xl md:text-4xl lg:text-5xl font-black text-white mb-2 md:mb-3 leading-tight tracking-tight drop-shadow-lg line-clamp-2">
                    {anime.title_english || anime.title}
                </h1>

                <div className="flex items-center gap-3 text-gray-300 text-[10px] md:text-xs mb-3 md:mb-4 font-medium">
                    <span className="flex items-center gap-1.5"><FaPlayCircle className="text-hianime-accent"/> {anime.type}</span>
                    <span className="flex items-center gap-1.5"><FaClock className="text-hianime-accent"/> {anime.duration}</span>
                    <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-hianime-accent"/> {anime.year || '2024'}</span>
                    <span className="bg-hianime-accent text-black px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">HD</span>
                </div>

                <p className="text-gray-400 line-clamp-2 md:line-clamp-3 text-xs md:text-sm mb-4 md:mb-6 leading-relaxed max-w-lg font-medium hidden sm:block">
                    {anime.synopsis}
                </p>
                
                <div className="flex flex-row gap-3">
                    <a 
                        href={`https://hianime.nz/search?keyword=${encodeURIComponent(anime.title_english || anime.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-hianime-accent text-black px-6 py-2 md:px-8 md:py-2.5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-white hover:scale-105 transition shadow-[0_0_15px_rgba(56,189,248,0.3)] text-xs md:text-sm w-auto"
                    >
                        <FaPlay /> Watch Now
                    </a>

                    <Link 
                        to={`/anime/${anime.mal_id}`} 
                        className="bg-white/10 text-white border border-white/20 px-6 py-2 md:px-6 md:py-2.5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-black transition text-xs md:text-sm backdrop-blur-md w-auto"
                    >
                        Detail <span className="ml-1">›</span>
                    </Link>
                </div>
            </div>
        </div>
    </div>

    {/* 3. PROGRESS BAR & DOTS */}
    <div className="absolute bottom-3 md:bottom-6 left-0 right-0 z-30 flex flex-col items-center gap-4 pointer-events-auto">
        <div className="flex gap-2 md:gap-3">
            {animes.map((_, idx) => (
                <button 
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); goToSlide(idx); }}
                    className={`h-1.5 md:h-2 rounded-full transition-all duration-300 cursor-pointer shadow-sm ${
                        idx === currentIndex 
                        ? 'bg-hianime-accent w-6 md:w-8'  
                        : 'bg-white/30 w-1.5 md:w-2 hover:bg-white'
                    }`}
                />
            ))}
        </div>
    </div>
    </div>
  );
};

export default Hero;