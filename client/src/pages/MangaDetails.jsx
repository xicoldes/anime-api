import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { FaBookOpen, FaStar, FaPlus, FaCheck, FaChevronUp, FaUserAlt, FaGoogle } from 'react-icons/fa';

const MangaDetails = () => {
  const { id } = useParams();
  const [manga, setManga] = useState(null);
  const [isAdded, setIsAdded] = useState(false);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

  // 1. Get current user
  const user = localStorage.getItem('user'); 
  const listKey = `mangalists_${user}`; // Separate key for manga list

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Only check list if user is logged in
    if (user) {
        const savedList = JSON.parse(localStorage.getItem(listKey)) || [];
        if (savedList.includes(id)) {
            setIsAdded(true);
        }
    }

    api.manga.getDetails(id).then(res => setManga(res.data.data));
  }, [id, listKey, user]);

  const handleAddToList = () => {
      // 2. CHECK: Is user logged in?
      if (!user) {
          alert("Please login to add manga to your collection!");
          return;
      }

      let savedList = JSON.parse(localStorage.getItem(listKey)) || [];
      if (isAdded) {
          savedList = savedList.filter(itemId => itemId !== id);
          setIsAdded(false);
      } else {
          savedList.push(id);
          setIsAdded(true);
      }
      localStorage.setItem(listKey, JSON.stringify(savedList));
  };

  if (!manga) return <div className="h-screen flex items-center justify-center text-hianime-accent">Loading...</div>;

  return (
    <div className="min-h-screen pb-20 bg-hianime-dark">
        {/* Main Content */}
        <div className="max-w-[1400px] mx-auto px-6 mt-24 flex flex-col lg:flex-row gap-12 animate-fade-in">
            
            {/* Left Column */}
            <div className="flex-1">
                <div className="flex flex-col md:flex-row gap-8 mb-12">
                    <img src={manga.images.jpg.large_image_url} className="w-64 h-96 object-cover rounded-lg shadow-2xl border-4 border-hianime-sidebar self-start" />
                    <div className="pt-4">
                        <div className="text-hianime-accent text-sm font-bold tracking-widest mb-2">#Ranked {manga.rank}</div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">{manga.title}</h1>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-6 font-medium items-center">
                            <span className="bg-white text-black px-2 py-0.5 rounded font-bold uppercase text-xs">{manga.status}</span>
                            <span className="flex items-center gap-1"><FaStar className="text-yellow-400"/> {manga.score}</span>
                            <span className="flex items-center gap-1"><FaBookOpen className="text-hianime-accent"/> {manga.volumes || '?'} Vols</span>
                            <span className="flex items-center gap-1 bg-hianime-sidebar px-2 py-0.5 rounded text-xs border border-hianime-accent">{manga.type}</span>
                        </div>

                        <div className="flex gap-4 mb-8">
                            {/* ADD TO LIST BUTTON WITH LOGIN CHECK */}
                            <button 
                                onClick={handleAddToList}
                                className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 transition border border-white/10 ${
                                    isAdded ? "bg-green-500 text-black hover:bg-green-400" : "bg-hianime-sidebar text-white hover:bg-hianime-accent hover:text-black"
                                }`}
                            >
                                {isAdded ? <FaCheck /> : <FaPlus />} 
                                {isAdded ? "Added to Collection" : "Add to Collection"}
                            </button>
                        </div>

                        <div className="relative mb-8">
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
                    <div className="mb-4"><span className="font-bold text-white">Published:</span> <span className="text-gray-400">{manga.published.string}</span></div>
                    <div className="mb-4"><span className="font-bold text-white">Status:</span> <span className="text-gray-400">{manga.status}</span></div>
                    <div className="mb-4"><span className="font-bold text-white">MAL Score:</span> <span className="text-gray-400">{manga.score}</span></div>
                    
                    <div className="mb-4 border-t border-white/10 pt-4">
                        <span className="font-bold text-white block mb-2">Authors:</span>
                        <div className="flex flex-wrap gap-2">
                            {manga.authors.map(author => (
                                <a 
                                    key={author.mal_id}
                                    href={author.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-hianime-accent hover:underline flex items-center gap-1 text-xs"
                                >
                                    <FaUserAlt className="text-[10px]"/> {author.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4 border-t border-white/10 pt-4">
                        <span className="font-bold text-white block mb-2">Genres:</span>
                        <div className="flex flex-wrap gap-2">
                            {manga.genres.map(g => (
                                <span key={g.mal_id} className="text-xs border border-gray-600 px-2 py-1 rounded-full text-gray-300 hover:text-hianime-accent cursor-pointer transition">
                                    {g.name}
                                </span>
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