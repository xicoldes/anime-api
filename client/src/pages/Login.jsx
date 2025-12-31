import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      // Save user to LocalStorage
      localStorage.setItem('user', username.trim());
      // Refresh page/navigate to home so Navbar updates
      window.location.href = '/'; 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hianime-dark px-4">
      <div className="bg-hianime-sidebar p-8 rounded-xl border border-white/5 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back!</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Login to access your personal watchlist</p>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Username</label>
            <input 
              type="text" 
              placeholder="Enter your name..." 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded px-4 py-3 text-white outline-none focus:border-hianime-accent transition"
              required
            />
          </div>
          
          <button type="submit" className="bg-hianime-accent text-black font-bold py-3 rounded hover:bg-pink-300 transition mt-2">
            Login
          </button>
        </form>
        
        <p className="text-center text-gray-500 text-xs mt-6">
          (This is a simulated login. No password required.)
        </p>
      </div>
    </div>
  );
};

export default Login;