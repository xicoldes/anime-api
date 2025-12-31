import React, { useState, useEffect } from 'react';
import { FaSearch, FaDatabase } from 'react-icons/fa'; // Changed Icon
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(storedUser);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(query) {
        navigate(`/search/${query}`);
        setQuery('');
    }
  };

  const handleLogout = () => {
      localStorage.removeItem('user');
      window.location.href = '/';
  };

  return (
    // Updated: Glassmorphism effect + Blue border bottom
    <nav className="fixed top-0 w-full z-50 bg-hianime-dark/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-xl border-b border-white/5">
      <div className="flex items-center gap-8">
        {/* NEW LOGO: AnimeWiki */}
        <Link to="/" className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 hover:opacity-80 transition">
          <FaDatabase className="text-hianime-accent" />
          <span>Anime<span className="text-hianime-accent">Wiki</span></span>
        </Link>
        
        <div className="hidden md:flex gap-6 text-gray-400 font-medium text-sm">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <Link to="/manga" className="hover:text-white transition">Manga Database</Link>
            <Link to="/watchlist" className="hover:text-white transition">My Collections</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <form onSubmit={handleSubmit} className="hidden md:flex bg-hianime-sidebar border border-white/10 rounded-full overflow-hidden h-10 w-72 focus-within:border-hianime-accent transition duration-300">
            <input 
                type="text" 
                placeholder="Search database..." 
                className="flex-1 px-4 bg-transparent text-white text-sm outline-none placeholder-gray-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="px-4 text-gray-400 hover:text-white">
                <FaSearch />
            </button>
        </form>
        
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