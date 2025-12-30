import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const Manga = () => {
  const [mangaList, setMangaList] = useState([]);

  useEffect(() => {
    api.manga.getTop().then(res => setMangaList(res.data.data));
  }, []);

  return (
    <div className="pt-24 min-h-screen max-w-[1400px] mx-auto px-6">
        <h2 className="text-3xl font-bold text-hianime-accent mb-8">Top Manga</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {mangaList.map(manga => (
                <div key={manga.mal_id} className="group cursor-pointer">
                    <div className="overflow-hidden rounded-lg aspect-[3/4] mb-3">
                        <img 
                            src={manga.images.jpg.large_image_url} 
                            alt={manga.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                        />
                    </div>
                    <h3 className="font-bold text-sm text-gray-200 group-hover:text-hianime-accent truncate transition">
                        {manga.title}
                    </h3>
                    <p className="text-xs text-gray-500">Vol: {manga.volumes || '?'} • Score: {manga.score}</p>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Manga;