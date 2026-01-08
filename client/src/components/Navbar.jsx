import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaDatabase } from 'react-icons/fa'; 
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { api } from '../services/api'; // Import API

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]); // Search Results
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Check if we are searching Manga or Anime based on URL
  const isMangaMode = location.pathname.includes('/manga');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(storedUser);

    // Click outside to close dropdown
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live Search Logic
  useEffect(() => {
      const fetchResults = async () => {
          if (query.length < 3) {
              setResults([]);
              setShowDropdown(false);
              return;
          }

          try {
              // Smart Switch: Search Manga if on Manga page, else Anime
              const searchCall = isMangaMode ? api.manga.search(query) : api.anime.search(query);
              const { data } = await searchCall;
              setResults(data.data.slice(0, 5)); // Limit to 5 results
              setShowDropdown(true);
          } catch (error) {
              console.error("Search failed", error);
          }
      };

      const timeoutId = setTimeout(fetchResults, 500); // Debounce typing
      return () => clearTimeout(timeoutId);
  }, [query, isMangaMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(query) {
        navigate(`/search/${query}`);
        setShowDropdown(false);
        setQuery('');
    }
  };

  const handleLogout = () => {
      localStorage.removeItem('user');
      window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-hianime-dark/95 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-xl border-b border-white/5">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 hover:opacity-80 transition">
          <FaDatabase className="text-hianime-accent" />
          <span>Anime<span className="text-hianime-accent">Wiki</span></span>
        </Link>
        
        <div className="hidden md:flex gap-6 text-gray-400 font-medium text-sm">
            <Link to="/" className={`hover:text-white transition ${!isMangaMode ? 'text-white font-bold' : ''}`}>Home</Link>
            <Link to="/manga" className={`hover:text-white transition ${isMangaMode ? 'text-white font-bold' : ''}`}>Manga Database</Link>
            <Link to="/watchlist" className="hover:text-white transition">My Collections</Link>
        </div>
      </div>

      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <form onSubmit={handleSubmit} className="hidden md:flex bg-hianime-sidebar border border-white/10 rounded-full overflow-hidden h-10 w-80 focus-within:border-hianime-accent transition duration-300 relative z-50">
            <input 
                type="text" 
                placeholder={isMangaMode ? "Search Manga..." : "Search Anime..."} 
                className="flex-1 px-4 bg-transparent text-white text-sm outline-none placeholder-gray-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => { if(results.length > 0) setShowDropdown(true); }}
            />
            <button type="submit" className="px-4 text-gray-400 hover:text-white">
                <FaSearch />
            </button>
        </form>

        {/* --- LIVE SEARCH DROPDOWN --- */}
        {showDropdown && results.length > 0 && (
            <div className="absolute top-12 right-0 md:right-auto md:left-0 w-80 bg-hianime-sidebar rounded-xl shadow-2xl border border-white/10 overflow-hidden animate-fade-in z-40">
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-black/20">
                    {isMangaMode ? "Manga Results" : "Anime Results"}
                </div>
                {results.map(item => (
                    <Link 
                        to={isMangaMode ? `/manga/${item.mal_id}` : `/anime/${item.mal_id}`} 
                        key={item.mal_id}
                        onClick={() => { setShowDropdown(false); setQuery(''); }}
                        className="flex gap-3 p-3 hover:bg-white/5 transition border-b border-white/5 last:border-0"
                    >
                        <img 
                            src={item.images.jpg.image_url} 
                            alt={item.title} 
                            className="w-10 h-14 object-cover rounded"
                        />
                        <div className="flex flex-col justify-center min-w-0">
                            <h4 className="text-white text-sm font-bold truncate">{item.title}</h4>
                            <div className="text-xs text-gray-500 flex gap-2">
                                <span>{item.year || (item.published?.from ? new Date(item.published.from).getFullYear() : 'N/A')}</span>
                                <span>•</span>
                                <span className="capitalize">{item.type}</span>
                            </div>
                        </div>
                    </Link>
                ))}
                <button 
                    onClick={handleSubmit} 
                    className="w-full text-center py-2 text-xs font-bold text-hianime-accent hover:bg-white/5 transition"
                >
                    View all results ›
                </button>
            </div>
        )}
        
        {user ? (
            <div className="flex items-center gap-3">
                <span className="text-gray-300 text-sm font-medium capitalize hidden md:block">{user}</span>
                <button onClick={handleLogout} className="bg-hianime-sidebar border border-white/10 text-white px-4 py-2 rounded-full font-bold hover:bg-red-500 hover:border-red-500 transition text-xs">
                    Logout
                </button>
            </div>
        ) : (
            <Link to="/login" className="bg-hianime-accent text-hianime-dark px-6 py-2 rounded-full font-bold hover:bg-white transition text-xs shadow-[0_0_10px_rgba(56,189,248,0.4)]">
                Login
            </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;