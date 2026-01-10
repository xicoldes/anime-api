import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
    FaBookOpen, FaStar, FaPlus, FaCheck, FaChevronUp, FaUserAlt, 
    FaTrophy, FaHeart, FaUsers, FaHashtag, FaTv, FaSearch 
} from 'react-icons/fa';

const MangaDetails = () => {
  const { id } = useParams();
  const [manga, setManga] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

  const user = localStorage.getItem('user'); 
  const listKey = `mangalists_${user}`; 

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (user) {
        const savedList = JSON.parse(localStorage.getItem(listKey)) || [];
        if (savedList.includes(id)) {
            setIsAdded(true);
        }
    }

    api.manga.getDetails(id).then(res => setManga(res.data.data));
    
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
    <div className="min-h-screen pb-20 bg-hianime-dark pt-24 text-gray-300">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row gap-10 animate-fade-in">
            
            {/* --- COLUMN 1: POSTER (Fixed Width) --- */}
            <div className="w-full lg:w-[260px] shrink-0 flex flex-col gap-4">
                <img 
                    src={manga.images.jpg.large_image_url} 
                    className="w-full rounded-xl shadow-2xl border border-white/10" 
                    alt={manga.title}
                />
            </div>

            {/* --- COLUMN 2: MAIN CONTENT (Fluid) --- */}
            <div className="flex-1">
                <div className="mb-6">
                    <div className="text-hianime-accent font-bold text-sm tracking-widest uppercase mb-2">
                        #Ranked {manga.rank || 'N/A'}
                    </div>
                    
                    {/* ENGLISH TITLE LOGIC */}
                    <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
                        {manga.title_english || manga.title}
                    </h1>
                    
                    {/* Mini Stats Line */}
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-6">
                        <span className="bg-white text-black px-2 py-0.5 rounded uppercase">{manga.type}</span>
                        {manga.published?.from && <span className="flex items-center gap-1"><FaBookOpen/> {new Date(manga.published.from).getFullYear()}</span>}
                        <span className="flex items-center gap-1 text-white"><FaStar className="text-yellow-400"/> {manga.score}</span>
                        <span className="text-gray-500">{manga.scored_by?.toLocaleString()} users</span>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-wrap gap-4 mb-8">
                        {/* READ NOW BUTTON */}
                        <a 
                            href={`https://mangakatana.com/?search=${encodeURIComponent(manga.title)}&search_by=book_name`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-hianime-accent text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-white hover:scale-105 transition shadow-[0_0_15px_rgba(255,186,222,0.3)]"
                        >
                            <FaBookOpen /> Read Now
                        </a>

                        {/* Add to Collection */}
                        <button 
                            onClick={handleAddToList}
                            className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 transition border border-white/10 ${
                                isAdded ? "bg-green-500 text-black hover:bg-green-400" : "bg-[#202225] text-white hover:bg-white/10"
                            }`}
                        >
                            {isAdded ? <FaCheck /> : <FaPlus />} 
                            {isAdded ? "Added" : "Add to Collection"}
                        </button>
                    </div>

                    {/* Synopsis */}
                    <div className="mb-8">
                        <h3 className="text-white font-bold text-lg mb-3 border-b border-white/10 pb-2">Synopsis</h3>
                        <p className={`text-gray-400 leading-relaxed text-sm mb-2 transition-all ${showFullSynopsis ? '' : 'line-clamp-4'}`}>
                            {manga.synopsis}
                        </p>
                        <button 
                            onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                            className="text-hianime-accent font-bold text-xs flex items-center gap-1 hover:text-white transition"
                        >
                            {showFullSynopsis ? <><FaChevronUp /> Show Less</> : <><FaPlus /> Read More</>}
                        </button>
                    </div>

                    {/* Background */}
                    {manga.background && (
                        <div className="mb-8">
                            <h3 className="text-white font-bold text-lg mb-3 border-b border-white/10 pb-2">Background</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{manga.background}</p>
                        </div>
                    )}

                    {/* Characters Grid */}
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

            {/* --- COLUMN 3: SIDEBAR (Fixed Width) --- */}
            <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-6">
                
                {/* Information Card */}
                <div className="bg-[#202225] p-5 rounded-xl border border-white/5 shadow-lg">
                    <h3 className="text-white font-bold mb-4 border-l-4 border-hianime-accent pl-3">Information</h3>
                    
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Japanese</span> 
                            <span className="text-gray-400 text-right truncate w-32">{manga.title_japanese}</span>
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
                            <span className="text-gray-400 text-right text-xs max-w-[150px]">{manga.published.string}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="font-bold text-white">Favorites</span> 
                            <span className="text-gray-400 flex items-center gap-1"><FaHeart className="text-red-500 text-[10px]"/> {manga.favorites?.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    {/* Authors with Wiki Links */}
                    <div className="mt-6">
                        <span className="font-bold text-white block mb-2 text-xs uppercase opacity-70">Authors</span>
                        <div className="flex flex-wrap gap-2">
                            {manga.authors.map(author => (
                                <a 
                                    key={author.mal_id}
                                    href={`https://www.google.com/search?q=${encodeURIComponent(author.name + ' wiki')}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-hianime-accent text-xs flex items-center gap-1 bg-black/20 px-2 py-1 rounded hover:bg-white/10 transition"
                                >
                                    <FaSearch className="text-[8px]"/> {author.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Genres */}
                    <div className="mt-6">
                        <span className="font-bold text-white block mb-2 text-xs uppercase opacity-70">Genres</span>
                        <div className="flex flex-wrap gap-1.5">
                            {[...(manga.genres || []), ...(manga.themes || []), ...(manga.demographics || [])].map(g => (
                                <Link 
                                    key={g.mal_id} 
                                    to={`/manga?genre=${g.mal_id}`}
                                    className="text-[10px] border border-gray-600 px-2 py-1 rounded-full text-gray-400 hover:text-black hover:bg-hianime-accent hover:border-hianime-accent cursor-pointer transition"
                                >
                                    {g.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Related Entries */}
                {manga.relations && manga.relations.length > 0 && (
                    <div className="bg-[#202225] p-5 rounded-xl border border-white/5 shadow-lg">
                        <h3 className="text-white font-bold mb-4 border-l-4 border-hianime-accent pl-3">Related Entries</h3>
                        <div className="space-y-4">
                            {manga.relations.slice(0, 4).map((rel, index) => (
                                <div key={index} className="text-sm">
                                    <span className="text-hianime-accent text-xs font-bold uppercase block mb-1">{rel.relation}</span>
                                    {rel.entry.map(entry => (
                                        <Link 
                                            key={entry.mal_id} 
                                            to={`/${entry.type}/${entry.mal_id}`}
                                            className="block text-gray-300 hover:text-white hover:underline truncate"
                                        >
                                            {entry.name} ({entry.type})
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
export default MangaDetails;