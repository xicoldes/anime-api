import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
    FaPlay, FaStar, FaPlus, FaCheck, FaChevronUp, 
    FaCalendarAlt, FaClock, FaExclamationTriangle
} from 'react-icons/fa';
import { BANNED_IDS } from '../utils/banned'; // <--- IMPORT THIS

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state

  const user = localStorage.getItem('user'); 
  const listKey = `watchlist_${user}`; 

  // --- CHECK BAN STATUS IMMEDIATELY ---
  const isBanned = BANNED_IDS.some(bannedId => String(bannedId) === String(id));

  useEffect(() => {
    if (isBanned) return; // Don't fetch if banned

    window.scrollTo(0, 0);
    setLoading(true);
    
    if (user) {
        const savedList = JSON.parse(localStorage.getItem(listKey)) || [];
        if (savedList.includes(id)) {
            setIsAdded(true);
        }
    }

    // Fetch Data
    api.anime.getFull(id)
        .then(res => {
            setAnime(res.data.data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    
    api.anime.getCharacters(id)
        .then(res => setCharacters(res.data.data))
        .catch(err => console.error(err));

  }, [id, listKey, user, isBanned]);

  // --- SHOW "404" IF BANNED ---
  if (isBanned) {
      return (
        <div className="h-screen flex flex-col items-center justify-center text-gray-400 bg-hianime-dark">
            <FaExclamationTriangle className="text-6xl text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Content Unavailable</h1>
            <p className="mb-6">This anime is not available on this platform.</p>
            <Link to="/" className="px-6 py-2 bg-hianime-accent text-black rounded-full font-bold hover:bg-white transition">
                Return Home
            </Link>
        </div>
      );
  }

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

  if (loading || !anime) return <div className="h-screen flex items-center justify-center text-hianime-accent">Loading...</div>;

  const isMovie = anime.type === 'Movie';

  return (
    <div className="min-h-screen pb-20 bg-hianime-dark pt-24 text-gray-300">
        
        {/* Header Background */}
        <div className="absolute top-0 w-full h-[500px] overflow-hidden z-0 opacity-20 mask-image-b pointer-events-none">
             <img src={anime.images.jpg.large_image_url} className="w-full h-full object-cover blur-3xl" alt="" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row gap-10 animate-fade-in">
            
            {/* --- COLUMN 1: POSTER --- */}
            <div className="w-full lg:w-[260px] shrink-0 flex flex-col gap-4">
                <img 
                    src={anime.images.jpg.large_image_url} 
                    className="w-full rounded-xl shadow-2xl border border-white/10" 
                    alt={anime.title}
                />
            </div>

            {/* --- COLUMN 2: MAIN CONTENT --- */}
            <div className="flex-1">
                <div className="mb-6">
                    <div className="text-hianime-accent font-bold text-sm tracking-widest uppercase mb-2">
                        #Ranked {anime.rank || 'N/A'}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                        {anime.title_english || anime.title}
                    </h1>
                    
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-6">
                        <span className="bg-white text-black px-2 py-0.5 rounded uppercase">{anime.type}</span>
                        {anime.year && <span className="flex items-center gap-1"><FaCalendarAlt/> {anime.year}</span>}
                        <span className="flex items-center gap-1"><FaClock/> {anime.duration}</span>
                        {anime.score && <span className="flex items-center gap-1 text-white"><FaStar className="text-yellow-400"/> {anime.score}</span>}
                    </div>

                    <div className="flex flex-wrap gap-4 mb-8">
                        <a 
                            href={`https://hianime.nz/search?keyword=${encodeURIComponent(anime.title_english || anime.title)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-hianime-accent text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-white hover:scale-105 transition shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                        >
                            <FaPlay /> Watch Now
                        </a>

                        <button 
                            onClick={handleAddToList}
                            className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 transition border border-white/10 ${
                                isAdded ? "bg-green-500 text-black hover:bg-green-400" : "bg-[#202225] text-white hover:bg-white/10"
                            }`}
                        >
                            {isAdded ? <FaCheck /> : <FaPlus />} 
                            {isAdded ? "Added to List" : "Add to List"}
                        </button>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-white font-bold text-lg mb-3 border-b border-white/10 pb-2">Synopsis</h3>
                        <p className={`text-gray-400 leading-relaxed text-sm mb-2 transition-all ${showFullSynopsis ? '' : 'line-clamp-4'}`}>
                            {anime.synopsis}
                        </p>
                        <button 
                            onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                            className="text-hianime-accent font-bold text-xs flex items-center gap-1 hover:text-white transition"
                        >
                            {showFullSynopsis ? <><FaChevronUp /> Show Less</> : <><FaPlus /> Read More</>}
                        </button>
                    </div>

                    {anime.trailer?.embed_url && (
                        <div className="mb-8">
                            <h3 className="text-white font-bold text-lg mb-4 border-b border-white/10 pb-2">Official Trailer</h3>
                            <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
                                <iframe 
                                    src={`${anime.trailer.embed_url}?autoplay=0`} 
                                    title="Trailer"
                                    className="w-full h-full"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    )}

                    {characters.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-white font-bold text-lg mb-4 border-b border-white/10 pb-2">Characters</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {characters.slice(0, 10).map((char, index) => (
                                    <div key={index} className="bg-[#202225] rounded-lg border border-white/5 overflow-hidden group hover:border-hianime-accent transition">
                                        <div className="h-28 overflow-hidden">
                                            <img 
                                                src={char.character.images.jpg.image_url} 
                                                alt={char.character.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            />
                                        </div>
                                        <div className="p-2">
                                            <h4 className="text-white text-[10px] font-bold truncate mb-1">{char.character.name}</h4>
                                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${char.role === 'Main' ? 'bg-hianime-accent text-black' : 'bg-white/10 text-gray-400'}`}>
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

            {/* --- COLUMN 3: SIDEBAR --- */}
            <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-6">
                <div className="bg-[#202225] p-5 rounded-xl border border-white/5 shadow-lg">
                    <h3 className="text-white font-bold mb-4 border-l-4 border-hianime-accent pl-3">Information</h3>
                    
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Japanese</span> 
                            <span className="text-gray-400 text-right truncate w-32">{anime.title_japanese}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Type</span> 
                            <span className="text-gray-400">{anime.type}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Episodes</span> 
                            <span className="text-gray-400">{anime.episodes || '?'}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Status</span> 
                            <span className={`${anime.status === 'Finished Airing' ? 'text-green-400' : 'text-hianime-accent'}`}>{anime.status}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Aired</span> 
                            <span className="text-gray-400 text-right text-xs max-w-[150px]">{anime.aired?.string}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Premiered</span> 
                            <span className="text-gray-400">{anime.season ? `${anime.season} ${anime.year}` : 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Studios</span> 
                            <span className="text-hianime-accent text-right truncate w-32">
                                {anime.studios?.map(s => s.name).join(', ')}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <span className="font-bold text-white block mb-2 text-xs uppercase opacity-70">Genres</span>
                        <div className="flex flex-wrap gap-1.5">
                            {[...(anime.genres || []), ...(anime.themes || []), ...(anime.demographics || [])].map(g => (
                                <Link 
                                    key={g.mal_id} 
                                    to={isMovie ? `/movies?genre=${g.mal_id}` : `/anime?genre=${g.mal_id}`}
                                    className="text-[10px] border border-gray-600 px-2 py-1 rounded-full text-gray-400 hover:text-black hover:bg-hianime-accent hover:border-hianime-accent cursor-pointer transition"
                                >
                                    {g.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {anime.relations && anime.relations.length > 0 && (
                    <div className="bg-[#202225] p-5 rounded-xl border border-white/5 shadow-lg">
                        <h3 className="text-white font-bold mb-4 border-l-4 border-hianime-accent pl-3">Related Anime</h3>
                        <div className="space-y-4">
                            {anime.relations.slice(0, 4).map((rel, index) => (
                                <div key={index} className="text-sm">
                                    <span className="text-hianime-accent text-xs font-bold uppercase block mb-1">{rel.relation}</span>
                                    {rel.entry.map(entry => (
                                        <Link 
                                            key={entry.mal_id} 
                                            to={`/${entry.type}/${entry.mal_id}`}
                                            className="block text-gray-300 hover:text-white hover:underline truncate"
                                        >
                                            {entry.name}
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default AnimeDetails;