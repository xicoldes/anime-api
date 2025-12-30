import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    // Fetch Anime Info
    api.anime.getFull(id).then(res => setAnime(res.data.data));
    // Fetch Characters
    api.anime.getCharacters(id).then(res => setCharacters(res.data.data));
  }, [id]);

  if (!anime) return <div className="h-screen flex items-center justify-center text-hianime-accent">Loading...</div>;

  return (
    <div className="min-h-screen pt-20 pb-20">
        {/* Banner */}
        <div className="h-[40vh] bg-cover bg-center relative" style={{backgroundImage: `url(${anime.images.jpg.large_image_url})`}}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        </div>

        {/* Info Section */}
        <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10 flex flex-col md:flex-row gap-8 mb-16">
            <img src={anime.images.jpg.large_image_url} className="w-64 rounded-lg shadow-2xl border-4 border-hianime-sidebar" />
            
            <div className="flex-1 pt-10 md:pt-32">
                <h1 className="text-4xl font-bold text-white mb-4">{anime.title}</h1>
                <div className="flex gap-4 text-sm text-gray-300 mb-6">
                    <span className="bg-hianime-accent text-black px-2 rounded font-bold">{anime.type}</span>
                    <span>{anime.duration}</span>
                    <span>{anime.status}</span>
                    <span>Score: {anime.score}</span>
                </div>
                <p className="text-gray-300 leading-relaxed mb-6 text-sm">{anime.synopsis}</p>
                
                {/* Trailer */}
                {anime.trailer?.embed_url && (
                    <div className="aspect-video w-full max-w-2xl rounded-lg overflow-hidden border border-gray-700 bg-black">
                        <iframe src={anime.trailer.embed_url} className="w-full h-full" allowFullScreen></iframe>
                    </div>
                )}
            </div>
        </div>

        {/* Characters Section */}
        <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-hianime-accent mb-6">Characters & Voice Actors</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {characters.slice(0, 10).map((char, idx) => (
                    <div key={idx} className="bg-hianime-sidebar rounded-lg p-3 flex gap-3 hover:bg-white/5 transition">
                        <img 
                            src={char.character.images.jpg.image_url} 
                            alt={char.character.name} 
                            className="w-12 h-12 rounded-full object-cover" 
                        />
                        <div className="overflow-hidden">
                            <h4 className="text-sm font-bold text-white truncate">{char.character.name}</h4>
                            <p className="text-xs text-gray-400 truncate">{char.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
export default AnimeDetails;