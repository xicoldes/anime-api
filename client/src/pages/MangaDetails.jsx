import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { FaStar, FaBookOpen, FaCalendarAlt, FaPlus, FaCheck, FaChevronUp } from 'react-icons/fa';

const MangaDetails = () => {
  const { id } = useParams();
  const [manga, setManga] = useState(null);
  const [isAdded, setIsAdded] = useState(false);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

  // User Watchlist Logic (Reusing the same logic for Manga)
  const user = localStorage.getItem('user') || 'guest';
  const listKey = `mangalist_${user}`; // Different key for manga list

  useEffect(() => {
    window.scrollTo(0, 0);

    // Check Local Storage
    const savedList = JSON.parse(localStorage.getItem(listKey)) || [];
    if (savedList.includes(id)) {
        setIsAdded(true);
    }

    // Fetch Manga Details
    api.manga.getDetails(id).then(res => setManga(res.data.data));
  }, [id, listKey]);

  const toggleList = () => {
      let savedList = JSON.parse(localStorage.getItem(listKey)) || [];
      if (isAdded) {
          savedList = savedList.filter(item => item !== id);
          setIsAdded(false);
      } else {
          savedList.push(id);
          setIsAdded(true);
      }
      localStorage.setItem(listKey, JSON.stringify(savedList));
  };

  if (!manga) return <div className="h-screen flex items-center justify-center text-hianime-accent">Loading...</div>;

  return (
    <div className="min-h-screen pt-20 pb-20">
        {/* Banner - Blurs the poster since Manga rarely has wide banners */}
        <div 
            className="h-[50vh] bg-cover bg-center relative blur-xl scale-110 opacity-50" 
            style={{backgroundImage: `url(${manga.images.jpg.large_image_url})`}}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-hianime-dark via-hianime-dark/60 to-black/40"></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 -mt-32 relative z-10 flex flex-col lg:flex-row gap-12">
            
            {/* Left Column */}
            <div className="flex-1">
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <img src={manga.images.jpg.large_image_url} className="w-64 h-96 object-cover rounded-lg shadow-2xl border-4 border-hianime-sidebar self-start" />
                    <div className="pt-4 md:pt-12">
                        <div className="text-hianime-accent text-sm font-bold tracking-widest mb-2">#Ranked {manga.rank}</div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">{manga.title}</h1>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-6 font-medium items-center">
                            <span className="bg-white text-black px-2 py-0.5 rounded font-bold uppercase text-xs">{manga.type}</span>
                            <span className="flex items-center gap-1"><FaStar className="text-yellow-400"/> {manga.score}</span>
                            <span className="flex items-center gap-1"><FaBookOpen /> {manga.volumes || '?'} Vols</span>
                            <span className="flex items-center gap-1"><FaCalendarAlt /> {manga.published.prop.from.year || 'N/A'}</span>
                        </div>

                        <div className="flex gap-4 mb-8">
                            <button 
                                onClick={toggleList}
                                className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 transition border border-white/10 ${
                                    isAdded ? "bg-green-500 text-black hover:bg-green-400" : "bg-gray-800 text-white hover:bg-gray-700"
                                }`}
                            >
                                {isAdded ? <FaCheck /> : <FaPlus />} 
                                {isAdded ? "Added to List" : "Add to List"}
                            </button>
                        </div>

                        {/* SYNOPSIS */}
                        <div className="relative">
                            <p className={`text-gray-300 leading-relaxed text-sm mb-2 transition-all ${showFullSynopsis ? '' : 'line-clamp-4'}`}>
                                {manga.synopsis}
                            </p>
                            <button 
                                onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                                className="text-hianime-accent font-bold text-xs flex items-center gap-1 hover:text-white transition"
                            >
                                {showFullSynopsis ? <><FaChevronUp /> Show Less</> : <><FaPlus /> Read More</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-80 shrink-0">
                <div className="bg-hianime-sidebar p-6 rounded-xl border border-white/5 mb-8 text-sm">
                    <div className="mb-4"><span className="font-bold text-white">Japanese:</span> <span className="text-gray-400">{manga.title_japanese}</span></div>
                    <div className="mb-4"><span className="font-bold text-white">Authors:</span> <span className="text-hianime-accent">{manga.authors.map(a => a.name).join(', ')}</span></div>
                    <div className="mb-4"><span className="font-bold text-white">Published:</span> <span className="text-gray-400">{manga.published.string}</span></div>
                    <div className="mb-4"><span className="font-bold text-white">Status:</span> <span className="text-gray-400">{manga.status}</span></div>
                    <div className="mb-4"><span className="font-bold text-white">Score:</span> <span className="text-gray-400">{manga.score}</span></div>
                    <div className="mb-4"><span className="font-bold text-white">Volumes:</span> <span className="text-gray-400">{manga.volumes || 'Unknown'}</span></div>
                    <div className="mb-4"><span className="font-bold text-white">Chapters:</span> <span className="text-gray-400">{manga.chapters || 'Unknown'}</span></div>
                    
                    <div className="mb-4 border-t border-white/10 pt-4">
                        <span className="font-bold text-white block mb-2">Genres:</span>
                        <div className="flex flex-wrap gap-2">
                            {manga.genres.map(g => (
                                <span key={g.mal_id} className="text-xs border border-gray-600 px-2 py-1 rounded-full text-gray-300 hover:text-hianime-accent cursor-pointer transition">{g.name}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
export default MangaDetails;