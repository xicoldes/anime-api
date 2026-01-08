import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Hero from '../components/Hero';
import Trending from '../components/Trending';
import { api } from '../services/api';
import { FaFilter, FaSortAmountDown, FaFilm, FaChevronRight } from 'react-icons/fa';

const Home = () => {
  const [spotlight, setSpotlight] = useState([]); 
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [movies, setMovies] = useState([]); // Movies State
  const [genres, setGenres] = useState([]);
  
  const [searchParams] = useSearchParams();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [filteredAnimes, setFilteredAnimes] = useState(null); 
  const [showFilter, setShowFilter] = useState(false);
  const [selectedSort, setSelectedSort] = useState('default');

  useEffect(() => {
    const fetchData = async () => {
        // 1. Spotlight
        api.anime.getSpotlight().then(data => setSpotlight(data)).catch(err => console.error("Spotlight Fail", err));

        // 2. Trending
        api.top.getAnime().then(res => setTrending(res.data.data)).catch(err => console.error("Trending Fail", err));

        // 3. Latest Episodes
        api.seasons.getNow().then(res => setLatest(res.data.data)).catch(err => console.error("Latest Fail", err));

        // 4. MOVIES (This uses the new correct endpoint)
        api.movies.getTop().then(res => {
            console.log("Movies Loaded:", res.data.data); // Check console to see if data arrives
            setMovies(res.data.data);
        }).catch(err => console.error("Movies Fail", err));
        
        // 5. Genres
        api.anime.getGenres().then(res => setGenres(res.data.data)).catch(err => console.error("Genres Fail", err));
    };
    fetchData();
  }, []);

  useEffect(() => {
      const genreParam = searchParams.get('genre');
      if (genreParam) {
          const genreId = parseInt(genreParam);
          setSelectedGenre(genreId);
          setShowFilter(true);
          performSearch(genreId, selectedSort);
          setTimeout(() => {
              window.scrollTo({ top: window.innerHeight * 0.6, behavior: 'smooth' });
          }, 500);
      }
  }, [searchParams]);

  const performSearch = async (genreId, sortValue) => {
    let orderBy = null;
    let sort = 'desc'; 

    switch(sortValue) {
        case 'score': orderBy = 'score'; break;
        case 'popularity': orderBy = 'popularity'; break;
        case 'title': orderBy = 'title'; sort = 'asc'; break;
        case 'start_date': orderBy = 'start_date'; break;
        case 'episodes': orderBy = 'episodes'; break;
        case 'favorites': orderBy = 'favorites'; break;
        default: orderBy = null;
    }

    try {
        if (orderBy || genreId) {
            const res = await api.anime.search('', genreId, orderBy, sort);
            setFilteredAnimes(res.data.data);
        } else {
            setFilteredAnimes(null);
        }
    } catch (err) {
        console.error(err);
    }
  };

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
    performSearch(genreId, selectedSort);
  };

  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    setSelectedSort(sortValue);
    performSearch(selectedGenre, sortValue);
  };

  const clearFilter = () => {
      setSelectedGenre(null);
      setSelectedSort('default');
      setFilteredAnimes(null);
  };

  return (
    <div>
      {!filteredAnimes && spotlight.length > 0 && <Hero animes={spotlight} />}

      <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-3">
            
            {/* Filter Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-hianime-accent self-start md:self-auto">
                    {filteredAnimes ? `Search Results` : `Latest Episodes`}
                </h2>
                
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex items-center bg-hianime-sidebar px-3 py-2 rounded border border-white/10">
                        <FaSortAmountDown className="text-gray-400 mr-2" />
                        <select 
                            value={selectedSort}
                            onChange={handleSortChange}
                            className="bg-transparent text-sm text-white outline-none cursor-pointer appearance-none pr-8"
                        >
                            <option value="default" className="text-black">Default</option>
                            <option value="score" className="text-black">Highest Score</option>
                            <option value="popularity" className="text-black">Most Popular</option>
                            <option value="title" className="text-black">Name A-Z</option>
                            <option value="start_date" className="text-black">Release Date</option>
                            <option value="episodes" className="text-black">Episode Count</option>
                        </select>
                    </div>

                    <button 
                        onClick={() => setShowFilter(!showFilter)} 
                        className="flex items-center gap-2 bg-hianime-sidebar px-4 py-2 rounded text-sm hover:bg-hianime-accent hover:text-black transition"
                    >
                        <FaFilter /> Filter
                    </button>
                </div>
            </div>

            {/* Genre Filter Panel */}
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
                                className={`px-3 py-1 rounded text-xs transition ${
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

            {/* --- LATEST EPISODES GRID --- */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
                {(filteredAnimes || latest.slice(0, 12)).map(anime => (
                    <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id} className="group relative cursor-pointer">
                        <div className="overflow-hidden rounded-lg aspect-[3/4] mb-2 relative">
                            <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                            <div className="absolute top-2 left-2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                Ep {anime.episodes || '?'}
                            </div>
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-center items-center p-4 text-center">
                                <span className="text-hianime-accent text-sm font-bold mb-2">View Details</span>
                                <span className="text-xs text-gray-300">{anime.type} • {anime.year || 'N/A'}</span>
                            </div>
                        </div>
                        <h3 className="font-bold text-sm text-gray-200 group-hover:text-hianime-accent truncate transition">{anime.title}</h3>
                    </Link>
                ))}
            </div>

            {/* --- NEW SECTION: POPULAR MOVIES --- */}
            {!filteredAnimes && movies.length > 0 && (
                <div className="animate-slide-up">
                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                        <h2 className="text-2xl font-bold text-hianime-accent flex items-center gap-2">
                            <FaFilm /> Popular Movies
                        </h2>
                        <Link to="/movies" className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1 transition">
                            View All <FaChevronRight size={10} />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {movies.slice(0, 8).map(movie => (
                            <Link to={`/anime/${movie.mal_id}`} key={movie.mal_id} className="group relative cursor-pointer">
                                <div className="overflow-hidden rounded-lg aspect-[3/4] mb-2 relative">
                                    <img src={movie.images.jpg.large_image_url} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                    <div className="absolute top-2 left-2 bg-hianime-accent text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                        MOVIE
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                        {movie.duration}
                                    </div>
                                </div>
                                <h3 className="font-bold text-sm text-gray-200 group-hover:text-hianime-accent truncate transition">{movie.title}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            
            {filteredAnimes && filteredAnimes.length === 0 && (
                <div className="text-center text-gray-500 py-10">No anime found for this selection.</div>
            )}
        </div>

        <div className="lg:col-span-1">
            <Trending animes={trending} />
        </div>

      </div>
    </div>
  );
};

export default Home;