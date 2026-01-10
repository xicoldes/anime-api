import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
    FaBookOpen, FaStar, FaPlus, FaCheck, FaChevronUp, FaUserAlt, 
    FaTrophy, FaHeart, FaUsers, FaHashtag, FaTv 
} from 'react-icons/fa';

const MangaDetails = () => {
  const { id } = useParams();
  const [manga, setManga] = useState(null);
  const [characters, setCharacters] = useState([]); // State for Characters
  const [isAdded, setIsAdded] = useState(false);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

  // 1. Get current user
  const user = localStorage.getItem('user'); 
  const listKey = `mangalists_${user}`; 

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check Watchlist
    if (user) {
        const savedList = JSON.parse(localStorage.getItem(listKey)) || [];
        if (savedList.includes(id)) {
            setIsAdded(true);
        }
    }

    // Fetch Manga Details
    api.manga.getDetails(id).then(res => setManga(res.data.data));
    
    // Fetch Characters (New)
    api.manga.getCharacters(id)
        .then(res => setCharacters(res.data.data))
        .catch(err => console.error(err));

  }, [id, listKey, user]);

  const handleAddToList = () => {
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
        
        {/* --- HEADER BACKGROUND BLUR --- */}
        <div className="absolute top-0 w-full h-[400px] overflow-hidden z-0 opacity-20 mask-image-b">
             <img src={manga.images.jpg.large_image_url} className="w-full h-full object-cover blur-3xl" alt="" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 mt-24 flex flex-col lg:flex-row gap-12 animate-fade-in">
            
            {/* Left Column (Main Info) */}
            <div className="flex-1">
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    {/* Cover Image */}
                    <img 
                        src={manga.images.jpg.large_image_url} 
                        className="w-64 h-96 object-cover rounded-lg shadow-2xl border-4 border-[#2a2c31] self-start" 
                        alt={manga.title}
                    />
                    
                    <div className="pt-2 w-full">
                        {/* Title Section */}
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-white text-black px-2 py-0.5 rounded font-bold uppercase text-[10px] tracking-wider">
                                {manga.type}
                            </span>
                            {manga.status === 'Finished' && <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Finished</span>}
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 leading-tight">{manga.title}</h1>
                        <p className="text-gray-400 text-sm font-medium mb-6">{manga.title_english || manga.title}</p>

                        {/* STATS BAR */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#202225]/80 backdrop-blur-md p-4 rounded-xl border border-white/5 mb-6">
                             <div className="flex flex-col">
                                <span className="text-xs text-gray-400 uppercase font-bold">Score</span>
                                <div className="flex items-center gap-1 text-white font-black text-xl">
                                    <FaStar className="text-yellow-400 text-sm"/> {manga.score || 'N/A'}
                                </div>
                                <span className="text-[10px] text-gray-500">{manga.scored_by?.toLocaleString()} users</span>
                             </div>
                             <div className="flex flex-col border-l border-white/10 pl-4">
                                <span className="text-xs text-gray-400 uppercase font-bold">Ranked</span>
                                <div className="flex items-center gap-1 text-white font-black text-xl">
                                    <span className="text-hianime-accent">#</span>{manga.rank || 'N/A'}
                                </div>
                             </div>
                             <div className="flex flex-col border-l border-white/10 pl-4">
                                <span className="text-xs text-gray-400 uppercase font-bold">Popularity</span>
                                <div className="flex items-center gap-1 text-white font-black text-xl">
                                    <FaHashtag className="text-gray-600 text-sm"/>{manga.popularity || 'N/A'}
                                </div>
                             </div>
                             <div className="flex flex-col border-l border-white/10 pl-4">
                                <span className="text-xs text-gray-400 uppercase font-bold">Members</span>
                                <div className="flex items-center gap-1 text-white font-black text-xl">
                                    <FaUsers className="text-gray-600 text-sm"/> {manga.members?.toLocaleString()}
                                </div>
                             </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mb-8">
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

                        {/* Synopsis */}
                        <div className="mb-8">
                            <h3 className="text-white font-bold text-lg mb-3 border-b border-white/10 pb-2">Synopsis</h3>
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

                        {/* Background Info */}
                        {manga.background && (
                            <div className="mb-8">
                                <h3 className="text-white font-bold text-lg mb-3 border-b border-white/10 pb-2">Background</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{manga.background}</p>
                            </div>
                        )}

                        {/* --- NEW: CHARACTERS SECTION --- */}
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

                        {/* Related Entries */}
                        {manga.relations && manga.relations.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-white font-bold text-lg mb-3 border-b border-white/10 pb-2">Related Entries</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {manga.relations.map((rel, index) => (
                                        <div key={index} className="flex gap-2 text-sm">
                                            <span className="text-hianime-accent font-bold min-w-[100px]">{rel.relation}:</span>
                                            <div className="flex flex-wrap gap-1">
                                                {rel.entry.map(entry => (
                                                    <Link 
                                                        key={entry.mal_id} 
                                                        to={`/${entry.type}/${entry.mal_id}`}
                                                        className="text-gray-300 hover:text-white hover:underline flex items-center gap-1"
                                                    >
                                                        {entry.type === 'anime' && <FaTv className="text-[10px] text-gray-500"/>}
                                                        {entry.name}
                                                    </Link>
                                                ))}
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
                            <span className="text-gray-400 text-right">{manga.title_japanese}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Type</span> 
                            <span className="text-gray-400">{manga.type}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Volumes</span> 
                            <span className="text-gray-400">{manga.volumes || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Chapters</span> 
                            <span className="text-gray-400">{manga.chapters || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Status</span> 
                            <span className={`${manga.status === 'Finished' ? 'text-green-400' : 'text-hianime-accent'}`}>{manga.status}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Published</span> 
                            <span className="text-gray-400 text-right max-w-[150px]">{manga.published.string}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Favorites</span> 
                            <span className="text-gray-400 flex items-center gap-1"><FaHeart className="text-red-500 text-[10px]"/> {manga.favorites?.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    {/* Authors */}
                    <div className="mt-6">
                        <span className="font-bold text-white block mb-2 text-xs uppercase opacity-70">Authors</span>
                        <div className="flex flex-wrap gap-2">
                            {manga.authors.map(author => (
                                <span key={author.mal_id} className="text-hianime-accent text-xs flex items-center gap-1 bg-black/20 px-2 py-1 rounded">
                                    <FaUserAlt className="text-[10px]"/> {author.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Serialization */}
                    {manga.serializations && manga.serializations.length > 0 && (
                         <div className="mt-4">
                            <span className="font-bold text-white block mb-2 text-xs uppercase opacity-70">Serialization</span>
                            <div className="flex flex-wrap gap-2">
                                {manga.serializations.map(mag => (
                                    <span key={mag.mal_id} className="text-gray-300 text-xs bg-white/5 px-2 py-1 rounded border border-white/10">
                                        {mag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Genres */}
                    <div className="mt-6">
                        <span className="font-bold text-white block mb-2 text-xs uppercase opacity-70">Genres & Themes</span>
                        <div className="flex flex-wrap gap-1.5">
                            {[...(manga.genres || []), ...(manga.themes || []), ...(manga.demographics || [])].map(g => (
                                <Link 
                                    key={g.mal_id} 
                                    to={`/manga?genre=${g.mal_id}`}
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
export default MangaDetails;