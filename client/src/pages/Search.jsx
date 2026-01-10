import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa';

const Search = () => {
  const { query } = useParams();
  const [searchParams] = useSearchParams();
  const searchTerm = query || searchParams.get('q');

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ has_next_page: false, last_visible_page: 1 });

  // Reset page when search term changes
  useEffect(() => {
      setPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (!searchTerm) return;

    const doSearch = async () => {
        setLoading(true);
        try {
            // Pass page to API
            const res = await api.anime.search(searchTerm, null, null, page);
            setResults(res.data.data);
            setPagination(res.data.pagination);
        } catch (err) { 
            console.error(err); 
            setResults([]);
        } finally {
            setLoading(false);
        }
    };
    doSearch();
  }, [searchTerm, page]); // Re-run when page changes

  const handlePageChange = (newPage) => {
      if (newPage < 1 || (pagination.last_visible_page && newPage > pagination.last_visible_page)) return;
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-24 min-h-screen max-w-[1400px] mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold mb-6 text-white">
            Search Results for: <span className="text-hianime-accent">"{searchTerm}"</span>
        </h2>
        
        {loading ? (
            <div className="text-center text-hianime-accent mt-20">Loading Results...</div>
        ) : (
            <>
                {results && results.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {results.map(item => (
                                <Link to={`/anime/${item.mal_id}`} key={item.mal_id} className="group">
                                    <div className="overflow-hidden rounded-lg aspect-[3/4] mb-2 relative">
                                        <img 
                                            src={item.images.jpg.large_image_url} 
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                                        />
                                        <div className="absolute top-2 left-2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase">
                                            {item.type}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-sm text-gray-200 truncate group-hover:text-hianime-accent transition">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-gray-500">{item.year || 'N/A'}</p>
                                </Link>
                            ))}
                        </div>

                         {/* --- PAGINATION COMPONENT --- */}
                        <div className="flex justify-center items-center gap-2 mt-12 animate-fade-in">
                            <button onClick={() => handlePageChange(1)} disabled={page === 1} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#202225] text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition"><FaAngleDoubleLeft /></button>
                            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#202225] text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition"><FaAngleLeft /></button>
                            
                            <div className="flex gap-2">
                                {[page - 2, page - 1, page, page + 1, page + 2].map(p => {
                                    if (p < 1 || (pagination.last_visible_page && p > pagination.last_visible_page)) return null;
                                    return (
                                        <button 
                                            key={p} 
                                            onClick={() => handlePageChange(p)} 
                                            className={`w-10 h-10 rounded-full font-bold text-sm transition shadow-lg ${
                                                page === p 
                                                ? 'bg-hianime-accent text-black scale-110 shadow-pink-500/20' 
                                                : 'bg-[#202225] text-gray-400 hover:bg-white/10'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                            </div>

                            <button onClick={() => handlePageChange(page + 1)} disabled={!pagination.has_next_page} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#202225] text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition"><FaAngleRight /></button>
                            <button onClick={() => handlePageChange(pagination.last_visible_page || page + 1)} disabled={!pagination.has_next_page} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#202225] text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition"><FaAngleDoubleRight /></button>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-500 mt-20">
                        No results found for "{searchTerm}".
                    </div>
                )}
            </>
        )}
    </div>
  );
};

export default Search;