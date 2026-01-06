import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { FaClock, FaStar, FaPlus, FaTv, FaCheck, FaChevronUp, FaPlay, FaGoogle } from 'react-icons/fa';

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [relations, setRelations] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

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

    api.anime.getFull(id).then(res => setAnime(res.data.data));
    api.anime.getCharacters(id).then(res => setCharacters(res.data.data));
    api.anime.getRelations(id).then(res => setRelations(res.data.data));
  }, [id, listKey, user]);

  const handleAddToList = () => {
      if (!user) {
          alert("Please login to add anime to your watchlist!");
          return;
      }
      let savedList = JSON.parse(localStorage.getItem(listKey)) || [];
      if (isAdded) {
          savedList = savedList.filter(animeId => animeId !== id);
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
        {/* REMOVED BANNER SECTION COMPLETELY */}

        {/* Main Content - Added mt-24 to push it below the navbar */}
        <div className="max-w-[1400px] mx-auto px-6 mt-24 flex flex-col lg:flex-row gap-12 animate-fade-in">
            
            {/* Left Column */}
            <div className="flex-1">
                <div className="flex flex-col md:flex-row gap-8 mb-12">
                    <img src={anime.images.jpg.large_image_url} className="w-64 h-96 object-cover rounded-lg shadow-2xl border-4 border-hianime-sidebar self-start" />
                    <div className="pt-4">
                        <div className="text-hianime-accent text-sm font-bold tracking-widest mb-2">#Ranked {anime.rank}</div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">{anime.title}</h1>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-6 font-medium items-center">
                            <span className="bg-white text-black px-2 py-0.5 rounded font-bold uppercase text-xs">{anime.rating?.split(' ')[0] || 'PG-13'}</span>
                            <span className="bg-hianime-accent text-black px-2 py-0.5 rounded font-bold uppercase text-xs">HD</span>
                            <span className="flex items-center gap-1"><FaStar className="text-yellow-400"/> {anime.score}</span>
                            <span className="flex items-center gap-1"><FaClock /> {anime.duration}</span>
                            <span className="flex items-center gap-1 bg-hianime-sidebar px-2 py-0.5 rounded text-xs border border-hianime-accent"><FaTv /> {anime.episodes || '?'} Eps</span>
                        </div>

                        <div className="flex gap-4 mb-8">
                            <button 
                                onClick={handleAddToList}
                                className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 transition border border-white/10 ${
                                    isAdded ? "bg-green-500 text-black hover:bg-green-400" : "bg-hianime-sidebar text-white hover:bg-hianime-accent hover:text-black"
                                }`}
                            >
                                {isAdded ? <FaCheck /> : <FaPlus />} 
                                {isAdded ? "Added to List" : "Add to List"}
                            </button>
                        </div>

                        <div className="relative mb-8">
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

                        {anime.trailer?.embed_url && (
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <FaPlay className="text-hianime-accent text-sm" /> Official Trailer
                                </h3>
                                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl border border-hianime-sidebar bg-black">
                                    <iframe src={anime.trailer.embed_url} title="Trailer" className="w-full h-full" allowFullScreen></iframe>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-hianime-accent mb-6 border-l-4 border-hianime-accent pl-4">Characters & Voice Actors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {characters.slice(0, 8).map((char, idx) => {
                            const japaneseVA = char.voice_actors.find(va => va.language === "Japanese");
                            return (
                                <div key={idx} className="bg-hianime-sidebar rounded-lg p-2 flex justify-between items-center border border-white/5 hover:bg-white/5 transition">
                                    <div className="flex gap-3 items-center">
                                        <img src={char.character.images.jpg.image_url} className="w-12 h-12 rounded-full object-cover" />
                                        <div>
                                            <h4 className="text-sm font-bold text-white">{char.character.name}</h4>
                                            <p className="text-[10px] text-gray-400">{char.role}</p>
                                        </div>
                                    </div>
                                    {japaneseVA && (
                                        <div className="text-right flex gap-3 items-center">
                                            <div>
                                                <h4 className="text-sm font-bold text-white">{japaneseVA.person.name}</h4>
                                                <p className="text-[10px] text-gray-400">{japaneseVA.language}</p>
                                            </div>
                                            <img src={japaneseVA.person.images.jpg.image_url} className="w-12 h-12 rounded-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-80 shrink-0">
                <div className="bg-hianime-sidebar p-6 rounded-xl border border-white/5 mb-8 text-sm">
                    <div className="mb-4"><span className="font-bold text-white">Japanese:</span> <span className="text-gray-400">{anime.title_japanese}</span></div>
                    <div className="mb-4"><span className="font-bold text-white">Aired:</span> <span className="text-gray-400">{anime.aired.string}</span></div>
                    <div className="mb-4"><span className="font-bold text-white">Status:</span> <span className="text-gray-400">{anime.status}</span></div>
                    <div className="mb-4"><span className="font-bold text-white">MAL Score:</span> <span className="text-gray-400">{anime.score}</span></div>
                    
                    {/* CLICKABLE GENRES */}
                    <div className="mb-4 border-t border-white/10 pt-4">
                        <span className="font-bold text-white block mb-2">Genres:</span>
                        <div className="flex flex-wrap gap-2">
                            {anime.genres.map(g => (
                                <Link 
                                    to={`/?genre=${g.mal_id}`} 
                                    key={g.mal_id} 
                                    className="text-xs border border-gray-600 px-2 py-1 rounded-full text-gray-300 hover:bg-hianime-accent hover:text-black hover:border-hianime-accent cursor-pointer transition"
                                >
                                    {g.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* CLICKABLE STUDIOS */}
                    <div className="mb-4 border-t border-white/10 pt-4">
                        <span className="font-bold text-white block mb-2">Studios:</span>
                        <div className="flex flex-wrap gap-2">
                            {anime.studios.map(s => (
                                <a 
                                    key={s.mal_id}
                                    href={`https://www.google.com/search?q=${s.name}+anime+studio`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-hianime-accent hover:underline flex items-center gap-1"
                                >
                                    {s.name} <FaGoogle className="text-[10px]" />
                                </a>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <span className="font-bold text-white block mb-2">Producers:</span>
                        <div className="text-gray-400 text-xs">{anime.producers.map(p => p.name).join(', ')}</div>
                    </div>
                </div>

                <div className="bg-hianime-sidebar p-6 rounded-xl border border-white/5">
                    <h3 className="font-bold text-hianime-accent mb-4 text-lg">Related Anime</h3>
                    <div className="flex flex-col gap-4">
                        {relations.length > 0 ? relations.slice(0, 5).map((rel, idx) => (
                            <div key={idx} className="border-l-2 border-hianime-accent pl-3">
                                <span className="text-xs uppercase text-gray-500 font-bold block mb-1">{rel.relation}</span>
                                {rel.entry.map(entry => (
                                    <Link to={`/anime/${entry.mal_id}`} key={entry.mal_id} className="block text-sm text-white hover:text-hianime-accent transition mb-1">{entry.name}</Link>
                                ))}
                            </div>
                        )) : <div className="text-gray-500 text-sm">No related anime found.</div>}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
export default AnimeDetails;