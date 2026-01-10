import React from 'react';
import { Link } from 'react-router-dom';

const Trending = ({ animes }) => {
  return (
    <div className="bg-hianime-sidebar p-5 rounded-xl border border-white/5 sticky top-24">
      <h2 className="text-lg font-bold text-hianime-accent mb-4">Top Trending</h2>
      <div className="flex flex-col gap-3">
        {animes.slice(0, 10).map((anime, index) => (
          <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded transition cursor-pointer group">
            {/* Start numbering from 11 since Spotlight covers 1-10 */}
            <span className={`text-xl font-bold font-mono ${index < 3 ? 'text-hianime-accent' : 'text-gray-600'}`}>
                {String(index + 11).padStart(2, '0')}
            </span>
            <img 
              src={anime.images.jpg.small_image_url} 
              alt={anime.title} 
              className="w-10 h-14 object-cover rounded"
            />
            <div className="overflow-hidden">
                <h4 className="text-white font-medium text-sm truncate group-hover:text-hianime-accent transition">
                    {anime.title_english || anime.title}
                </h4>
                <p className="text-[10px] text-gray-500 mt-0.5">{anime.type} • {anime.episodes || '?'} eps</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Trending;