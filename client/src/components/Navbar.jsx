import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
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
    <nav className="fixed top-0 w-full z-50 bg-hianime-sidebar/95 backdrop-blur-sm px-6 py-3 flex items-center justify-between shadow-lg border-b border-white/5">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-3xl font-black text-white tracking-tighter cursor-pointer decoration-transparent">
          L<span className="text-hianime-accent">!</span>Anime
        </Link>
        <div className="hidden md:flex gap-6 text-gray-300 font-semibold text-sm">
            <Link to="/" className="hover:text-hianime-accent transition">Home</Link>
            <Link to="/manga" className="hover:text-hianime-accent transition">Manga</Link>
            <Link to="/watchlist" className="hover:text-hianime-accent transition">My Watchlist</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <form onSubmit={handleSubmit} className="hidden md:flex bg-white rounded overflow-hidden h-9 w-64">
            <input 
                type="text" 
                placeholder="Search anime..." 
                className="flex-1 px-3 text-black text-sm outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="px-3 text-gray-600 hover:text-black bg-gray-100">
                <FaSearch />
            </button>
        </form>
        
        {user ? (
            <div className="flex items-center gap-3">
                <span className="text-white text-sm font-bold capitalize hidden md:block">Hi, {user}</span>
                <button onClick={handleLogout} className="bg-gray-700 text-white px-4 py-1.5 rounded font-bold hover:bg-gray-600 transition text-sm">
                    Logout
                </button>
            </div>
        ) : (
            <Link to="/login" className="bg-hianime-accent text-black px-5 py-1.5 rounded font-bold hover:bg-pink-300 transition text-sm">
                Login
            </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;