import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaTimes } from 'react-icons/fa'; // Added icons for better visuals

const Login = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('user', username.trim());
      window.location.href = '/'; 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#151719] px-4 relative overflow-hidden">
      
      {/* Background Decor (Optional glow effect) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-hianime-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-[#202225] p-8 rounded-2xl border border-white/5 w-full max-w-md shadow-2xl relative z-10 animate-fade-in">
        
        {/* Top Right Close Button */}
        <Link to="/" className="absolute top-4 right-4 text-gray-500 hover:text-white transition p-2 hover:bg-white/10 rounded-full">
            <FaTimes />
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome Back!</h2>
            <p className="text-gray-400 text-sm font-medium">Login to sync your watchlist across devices.</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Username</label>
            <input 
              type="text" 
              placeholder="Enter your name..." 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#151719] border border-white/10 rounded-lg px-4 py-3.5 text-white outline-none focus:border-hianime-accent focus:ring-1 focus:ring-hianime-accent transition placeholder-gray-600 font-medium"
              required
            />
          </div>
          
          <button type="submit" className="bg-hianime-accent text-black font-extrabold py-3.5 rounded-full hover:bg-white hover:scale-[1.02] active:scale-95 transition duration-300 shadow-[0_0_20px_rgba(255,186,222,0.3)] mt-2">
            Log In
          </button>
        </form>
        
        <p className="text-center text-gray-600 text-xs mt-6 mb-6">
          (This is a simulated login. No password required.)
        </p>

        {/* Pretty "Return to Home" Button */}
        <div className="pt-6 border-t border-white/5">
            <Link 
                to="/" 
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full border border-white/10 text-gray-400 text-sm font-bold hover:bg-white/5 hover:text-white hover:border-white/20 transition duration-300 group"
            >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" size={12} />
                Return to Home
            </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;