import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

const Search = () => {
  const { query } = useParams(); // Get the search term from URL
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doSearch = async () => {
        setLoading(true);
        try {
            const data = await api.anime.search(query);
            setResults(data.data.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };
    doSearch();
  }, [query]);

  return (
    <div className="pt-24 min-h-screen max-w-[1400px] mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6">Search Results for: <span className="text-hianime-accent">{query}</span></h2>
        
        {loading ? <div className="text-center">Loading...</div> : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {results.map(anime => (
                    <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id} className="group">
                        <div className="overflow-hidden rounded-lg aspect-[3/4] mb-2">
                            <img src={anime.images.jpg.large_image_url} className="w-full h-full object-cover group-hover:scale-105 transition" />
                        </div>
                        <h3 className="font-bold text-sm truncate group-hover:text-hianime-accent">{anime.title}</h3>
                        <p className="text-xs text-gray-400">{anime.type} • {anime.year || '?'}</p>
                    </Link>
                ))}
            </div>
        )}
    </div>
  );
};
export default Search;