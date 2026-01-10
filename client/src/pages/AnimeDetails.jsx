import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
    FaPlay, FaStar, FaPlus, FaCheck, FaChevronUp, FaUserAlt, 
    FaHeart, FaUsers, FaHashtag, FaTv, FaSearch 
} from 'react-icons/fa';

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

  // User Watchlist Logic
  const user = localStorage.getItem('user'); 
  const listKey = `watchlist_${user}`; 

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (user) {
        const savedList = JSON.parse(localStorage.getItem(listKey)) || [];
        if (savedList.includes(id)) {
            setIsAdded(true);
        }
    }

    // Fetch Anime Details
    api.anime.getFull(id).then(res => setAnime(res.data.data));
    
    // Fetch Characters
    api.anime.getCharacters(id)
        .then(res => setCharacters(res.data.data))
        .catch(err => console.error(err));

  }, [id, listKey, user]);

  const handleAddToList = () => {
      if (!user) {
          alert("Please login to add anime to your collection!");
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

  if (!anime) return <div className="h-screen flex items-center justify-center text-hianime-accent">Loading...</div>;

  return (
    <div className="min-h-screen pb-20 bg-hianime-dark">
        
        {/* Header Background */}
        <div className="absolute top-0 w-full h-[400px] overflow-hidden z-0 opacity-20 mask-image-b">
             <img src={anime.images.jpg.large_image_url} className="w-full h-full object-cover blur-3xl" alt="" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 mt-24 flex flex-col lg:flex-row gap-12 animate-fade-in">
            
            {/* Left Column */}
            <div className="flex-1">
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <img 
                        src={anime.images.jpg.large_image_url} 
                        className="w-64 h-96 object-cover rounded-lg shadow-2xl border-4 border-[#2a2c31] self-start" 
                        alt={anime.title}
                    />
                    
                    <div className="pt-2 w-full">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-white text-black px-2 py-0.5 rounded font-bold uppercase text-[10px] tracking-wider">
                                {anime.type}
                            </span>
                            {anime.status === 'Finished Airing' && <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Finished</span>}
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 leading-tight">
                            {anime.title_english || anime.title}
                        </h1>
                        <p className="text-gray-400 text-sm font-medium mb-6">{anime.title}</p>

                        {/* Stats Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#202225]/80 backdrop-blur-md p-4 rounded-xl border border-white/5 mb-6">
                             <div className="flex flex-col">
                                <span className="text-xs text-gray-400 uppercase font-bold">Score</span>
                                <div className="flex items-center gap-1 text-white font-black text-xl">
                                    <FaStar className="text-yellow-400 text-sm"/> {anime.score || 'N/A'}
                                </div>
                                <span className="text-[10px] text-gray-500">{anime.scored_by?.toLocaleString()} users</span>
                             </div>
                             <div className="flex flex-col border-l border-white/10 pl-4">
                                <span className="text-xs text-gray-400 uppercase font-bold">Ranked</span>
                                <div className="flex items-center gap-1 text-white font-black text-xl">
                                    <span className="text-hianime-accent">#</span>{anime.rank || 'N/A'}
                                </div>
                             </div>
                             <div className="flex flex-col border-l border-white/10 pl-4">
                                <span className="text-xs text-gray-400 uppercase font-bold">Popularity</span>
                                <div className="flex items-center gap-1 text-white font-black text-xl">
                                    <FaHashtag className="text-gray-600 text-sm"/>{anime.popularity || 'N/A'}
                                </div>
                             </div>
                             <div className="flex flex-col border-l border-white/10 pl-4">
                                <span className="text-xs text-gray-400 uppercase font-bold">Members</span>
                                <div className="flex items-center gap-1 text-white font-black text-xl">
                                    <FaUsers className="text-gray-600 text-sm"/> {anime.members?.toLocaleString()}
                                </div>
                             </div>
                        </div>

                        {/* Buttons Row */}
                        <div className="flex flex-wrap gap-4 mb-8">
                            {/* --- WATCH NOW BUTTON --- */}
                            <a 
                                href={`https://hianime.nz/search?keyword=${encodeURIComponent(anime.title_english || anime.title)}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-8 py-3 rounded-full font-bold flex items-center gap-2 transition bg-hianime-accent text-black hover:bg-white hover:scale-105 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                            >
                                <FaPlay /> Watch Now
                            </a>

                            {/* Add to Collection */}
                            <button 
                                onClick={handleAddToList}
                                className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 transition border border-white/10 ${
                                    isAdded ? "bg-green-500 text-black hover:bg-green-400" : "bg-hianime-sidebar text-white hover:bg-white/10"
                                }`}
                            >
                                {isAdded ? <FaCheck /> : <FaPlus />} 
                                {isAdded ? "Added" : "Add to List"}
                            </button>
                        </div>

                        {/* Synopsis */}
                        <div className="mb-8">
                            <h3 className="text-white font-bold text-lg mb-3 border-b border-white/10 pb-2">Synopsis</h3>
                            <p className={`text-gray-300 leading-relaxed text-sm mb-2 transition-all ${showFullSynopsis ? '' : 'line-clamp-4'}`}>
                                {anime.synopsis}
                            </p>
                            <button 
                                onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                                className="text-hianime-accent font-bold text-xs flex items-center gap-1 hover:text-white transition"
                            >
                                {showFullSynopsis ? <><FaChevronUp /> Show Less</> : <><FaPlus /> Read More</>}
                            </button>
                        </div>

                        {/* Characters */}
                        {characters.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-white font-bold text-lg mb-4 border-b border-white/10 pb-2">Characters</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {characters.slice(0, 10).map((char, index) => (
                                        <div key={index} className="bg-[#202225] rounded-lg border border-white/5 overflow-hidden group hover:border-hianime-accent transition">
                                            <div className="h-32 overflow-hidden">
                                                <img 
                                                    src={char.character.images.jpg.image_url} 
                                                    alt={char.character.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                />
                                            </div>
                                            <div className="p-3">
                                                <h4 className="text-white text-xs font-bold truncate mb-1">{char.character.name}</h4>
                                                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${char.role === 'Main' ? 'bg-hianime-accent text-black' : 'bg-white/10 text-gray-400'}`}>
                                                    {char.role}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-80 shrink-0">
                <div className="bg-[#202225] p-6 rounded-xl border border-white/5 mb-8 text-sm shadow-xl sticky top-24">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <span className="w-1 h-4 bg-hianime-accent rounded-full"></span> Information
                    </h3>

                    <div className="space-y-3">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Japanese</span> 
                            <span className="text-gray-400 text-right">{anime.title_japanese}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Type</span> 
                            <span className="text-gray-400">{anime.type}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Episodes</span> 
                            <span className="text-gray-400">{anime.episodes || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Status</span> 
                            <span className={`${anime.status === 'Finished Airing' ? 'text-green-400' : 'text-hianime-accent'}`}>{anime.status}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Aired</span> 
                            <span className="text-gray-400 text-right max-w-[150px]">{anime.aired?.string}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Producers</span> 
                            <span className="text-gray-400 text-right max-w-[150px]">
                                {anime.producers?.map(p => p.name).join(', ') || 'N/A'}
                            </span>
                        </div>
                    </div>
                    
                    {/* Genres */}
                    <div className="mt-6">
                        <span className="font-bold text-white block mb-2 text-xs uppercase opacity-70">Genres</span>
                        <div className="flex flex-wrap gap-1.5">
                            {[...(anime.genres || []), ...(anime.themes || []), ...(anime.demographics || [])].map(g => (
                                <Link 
                                    key={g.mal_id} 
                                    to={`/?genre=${g.mal_id}`}
                                    className="text-[11px] border border-gray-600 px-2 py-1 rounded-full text-gray-300 hover:text-black hover:bg-hianime-accent hover:border-hianime-accent cursor-pointer transition"
                                >
                                    {g.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
};
export default AnimeDetails;