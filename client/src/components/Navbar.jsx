import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaDatabase, FaBars, FaTimes } from 'react-icons/fa'; 
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { api } from '../services/api'; 

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]); 
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false); 
  
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Check if we are searching Manga or Anime based on URL
  const isMangaMode = location.pathname.includes('/manga');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(storedUser);

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
              const searchCall = isMangaMode ? api.manga.search(query) : api.anime.search(query);
              const { data } = await searchCall;
              setResults(data.data.slice(0, 5)); 
              setShowDropdown(true);
          } catch (error) {
              console.error("Search failed", error);
          }
      };

      const timeoutId = setTimeout(fetchResults, 500); 
      return () => clearTimeout(timeoutId);
  }, [query, isMangaMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(query) {
        // FIX: Add type=manga if we are in Manga Mode
        const typeParam = isMangaMode ? '&type=manga' : '&type=anime';
        navigate(`/search?q=${query}${typeParam}`);
        
        setShowDropdown(false);
        setQuery('');
        setIsMobileOpen(false); 
    }
  };

  const handleLogout = () => {
      localStorage.removeItem('user');
      window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-hianime-dark/95 backdrop-blur-md px-4 md:px-6 py-4 flex items-center justify-between shadow-xl border-b border-white/5">
      
      {/* Left Side: Mobile Menu Button & Logo */}
      <div className="flex items-center gap-4">
        {/* MOBILE TOGGLE BUTTON */}
        <button 
            className="md:hidden text-white text-xl p-2"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
            {isMobileOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* LOGO UPDATED HERE */}
        <Link to="/" className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 hover:opacity-80 transition z-50">
          <FaDatabase className="text-hianime-accent" />
          <span>Ani<span className="text-hianime-accent">Manga</span></span>
        </Link>
        
        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-6 text-gray-400 font-medium text-sm ml-4">
            <Link to="/" className={`hover:text-white transition ${!isMangaMode ? 'text-white font-bold' : ''}`}>Home</Link>
            <Link to="/manga" className={`hover:text-white transition ${isMangaMode ? 'text-white font-bold' : ''}`}>Manga Database</Link>
            <Link to="/watchlist" className="hover:text-white transition">My Collections</Link>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        
        {/* DESKTOP SEARCH BAR */}
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

        {/* LIVE SEARCH DROPDOWN */}
        {showDropdown && results.length > 0 && (
            <div className="hidden md:block absolute top-12 right-0 w-80 bg-hianime-sidebar rounded-xl shadow-2xl border border-white/10 overflow-hidden animate-fade-in z-40">
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
                                <span>{item.year || 'N/A'}</span>
                                <span>•</span>
                                <span className="capitalize">{item.type}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        )}
        
        {/* DESKTOP USER SECTION */}
        <div className="hidden md:flex items-center gap-3">
            {user ? (
                <>
                    <span className="text-gray-300 text-sm font-medium capitalize">{user}</span>
                    <button onClick={handleLogout} className="bg-hianime-sidebar border border-white/10 text-white px-4 py-2 rounded-full font-bold hover:bg-red-500 hover:border-red-500 transition text-xs">
                        Logout
                    </button>
                </>
            ) : (
                <Link to="/login" className="bg-hianime-accent text-hianime-dark px-6 py-2 rounded-full font-bold hover:bg-white transition text-xs shadow-[0_0_10px_rgba(56,189,248,0.4)]">
                    Login
                </Link>
            )}
        </div>

        {/* MOBILE RIGHT SIDE ELEMENTS (Search Icon & Login) */}
        <div className="flex items-center gap-3 md:hidden">
            <button className="text-white text-xl" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                <FaSearch />
            </button>
            {user ? (
                 <button onClick={handleLogout} className="text-white text-sm font-bold">Logout</button>
            ) : (
                <Link to="/login" className="bg-hianime-accent text-hianime-dark px-4 py-1.5 rounded-full font-bold hover:bg-white transition text-sm shadow-[0_0_10px_rgba(56,189,248,0.4)]">
                    Login
                </Link>
            )}
        </div>

      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      {isMobileOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#151719] border-t border-white/10 shadow-2xl p-4 flex flex-col gap-4 md:hidden animate-slide-down">
            
            {/* Mobile Search */}
            <form onSubmit={handleSubmit} className="bg-black/40 border border-white/10 rounded-lg flex items-center p-2">
                <FaSearch className="text-gray-500 ml-2" />
                <input 
                    type="text" 
                    placeholder={isMangaMode ? "Search Manga..." : "Search Anime..."} 
                    className="flex-1 bg-transparent px-3 text-white text-sm outline-none"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </form>

            {/* Mobile Results Preview */}
            {query.length >= 3 && results.length > 0 && (
                <div className="bg-black/20 rounded-lg p-2 max-h-40 overflow-y-auto">
                    {results.slice(0, 3).map(item => (
                         <Link 
                            to={isMangaMode ? `/manga/${item.mal_id}` : `/anime/${item.mal_id}`} 
                            key={item.mal_id}
                            onClick={() => setIsMobileOpen(false)}
                            className="flex items-center gap-3 p-2 hover:bg-white/5 rounded"
                        >
                            <img src={item.images.jpg.image_url} className="w-8 h-10 object-cover rounded" alt=""/>
                            <div className="text-xs text-white truncate">{item.title}</div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Mobile Links */}
            <div className="flex flex-col gap-2">
                <Link to="/" onClick={() => setIsMobileOpen(false)} className="text-gray-300 hover:text-hianime-accent py-2 border-b border-white/5">Home</Link>
                <Link to="/manga" onClick={() => setIsMobileOpen(false)} className="text-gray-300 hover:text-hianime-accent py-2 border-b border-white/5">Manga Database</Link>
                <Link to="/watchlist" onClick={() => setIsMobileOpen(false)} className="text-gray-300 hover:text-hianime-accent py-2 border-b border-white/5">My Collections</Link>
            </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;