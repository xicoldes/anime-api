import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { FaFilter, FaStar, FaBookOpen, FaSortAmountDown } from 'react-icons/fa';

const Manga = () => {
  const [mangaList, setMangaList] = useState([]); 
  const [genres, setGenres] = useState([]);       
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [filteredManga, setFilteredManga] = useState(null); 
  const [showFilter, setShowFilter] = useState(false);
  
  // Sort State
  const [selectedSort, setSelectedSort] = useState('default');

  useEffect(() => {
    api.manga.getTop().then(res => setMangaList(res.data.data));
    api.manga.getGenres().then(res => setGenres(res.data.data));
  }, []);

  // Handle Genre Click
  const handleGenreClick = async (genreId) => {
    setSelectedGenre(genreId);
    performSearch(genreId, selectedSort);
  };

  // Handle Sort Change
  const handleSortChange = (e) => {
      const sortValue = e.target.value;
      setSelectedSort(sortValue);
      performSearch(selectedGenre, sortValue);
  };

  // Search Function
  const performSearch = async (genreId, sortValue) => {
      let orderBy = null;
      let sort = 'desc'; 

      // MAPPING: UI Options -> Jikan API Parameters
      switch(sortValue) {
          case 'score': orderBy = 'score'; break;
          case 'popularity': orderBy = 'popularity'; break;
          case 'title': orderBy = 'title'; sort = 'asc'; break;
          case 'start_date': orderBy = 'start_date'; break;
          case 'favorites': orderBy = 'favorites'; break;
          case 'rank': orderBy = 'rank'; sort = 'asc'; break;
          default: orderBy = null;
      }

      try {
          // If we have a sort OR a filter, we must use the Search endpoint
          if (orderBy || genreId) {
              const res = await api.manga.search('', genreId, orderBy, sort);
              setFilteredManga(res.data.data);
          } else {
              // Reset to "Top Manga" if no filter/sort
              setFilteredManga(null);
          }
      } catch (err) {
          console.error(err);
      }
  };

  const clearFilter = () => {
      setSelectedGenre(null);
      setSelectedSort('default');
      setFilteredManga(null);
  };

  const displayList = filteredManga || mangaList;

  return (
    <div className="pt-24 min-h-screen max-w-[1400px] mx-auto px-6">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold text-hianime-accent self-start md:self-auto">
                {filteredManga ? "Results" : "Top Manga"}
            </h2>
            
            <div className="flex gap-4 w-full md:w-auto">
                {/* SORT DROPDOWN - FIXED CSS */}
                <div className="relative flex items-center bg-hianime-sidebar px-3 py-2 rounded border border-white/10">
                    <FaSortAmountDown className="text-gray-400 mr-2" />
                    <select 
                        value={selectedSort}
                        onChange={handleSortChange}
                        className="bg-transparent text-sm text-white outline-none cursor-pointer appearance-none pr-8"
                    >
                        {/* ADDED 'text-black' SO OPTIONS ARE VISIBLE */}
                        <option value="default" className="text-black">Default</option>
                        <option value="score" className="text-black">Highest Score</option>
                        <option value="popularity" className="text-black">Most Popular</option>
                        <option value="title" className="text-black">Name A-Z</option>
                        <option value="start_date" className="text-black">Release Date</option>
                        <option value="favorites" className="text-black">Most Favorites</option>
                    </select>
                </div>

                <button 
                    onClick={() => setShowFilter(!showFilter)} 
                    className="flex items-center gap-2 bg-hianime-sidebar px-4 py-2 rounded text-sm hover:bg-hianime-accent hover:text-black transition border border-white/10"
                >
                    <FaFilter /> Filter
                </button>
            </div>
        </div>

        {/* Filter Panel */}
        {showFilter && (
            <div className="bg-hianime-sidebar p-6 rounded-xl mb-8 border border-white/5 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold">Select Genre</h3>
                    {(selectedGenre || selectedSort !== 'default') && (
                        <button onClick={clearFilter} className="text-xs text-red-400 hover:underline">Clear All</button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {genres.map(genre => (
                        <button 
                            key={genre.mal_id}
                            onClick={() => handleGenreClick(genre.mal_id)}
                            className={`px-3 py-1 rounded text-xs transition border border-white/5 ${
                                selectedGenre === genre.mal_id 
                                ? 'bg-hianime-accent text-black font-bold' 
                                : 'bg-black/40 text-gray-300 hover:bg-white/10'
                            }`}
                        >
                            {genre.name}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* Manga Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {displayList.map(manga => (
                <Link to={`/manga/${manga.mal_id}`} key={manga.mal_id} className="group cursor-pointer">
                    <div className="overflow-hidden rounded-lg aspect-[3/4] mb-3 relative">
                        <img 
                            src={manga.images.jpg.large_image_url} 
                            alt={manga.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                        />
                        {!filteredManga && (
                            <div className="absolute top-2 left-2 bg-hianime-accent text-black text-[10px] font-bold px-2 py-0.5 rounded-sm">
                                #{manga.rank}
                            </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <FaStar className="text-yellow-400 text-[8px]" /> {manga.score}
                        </div>
                    </div>
                    
                    <h3 className="font-bold text-sm text-gray-200 group-hover:text-hianime-accent truncate transition">
                        {manga.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><FaBookOpen className="text-[10px]"/> {manga.volumes || '?'} Vols</span>
                        <span>•</span>
                        <span>{manga.type}</span>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  );
};

export default Manga;