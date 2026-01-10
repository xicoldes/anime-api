import axios from 'axios';

const BASE = "https://api.jikan.moe/v4";

export const api = {
    // --- ANIME ---
    anime: {
        getSpotlight: async () => {
             const { data } = await axios.get(`${BASE}/seasons/now?filter=tv&sfw&limit=10`);
             return data.data; 
        },
        // NEW: Fetch Current Season sorted by Popularity (Members)
        getTrending: async () => {
             const { data } = await axios.get(`${BASE}/seasons/now?filter=tv&sfw&order_by=members&sort=desc&limit=10`);
             return data.data; 
        },
        getFull: (id) => axios.get(`${BASE}/anime/${id}/full`),
        getCharacters: (id) => axios.get(`${BASE}/anime/${id}/characters`),
        getStaff: (id) => axios.get(`${BASE}/anime/${id}/staff`),
        getEpisodes: (id) => axios.get(`${BASE}/anime/${id}/episodes`),
        getRelations: (id) => axios.get(`${BASE}/anime/${id}/relations`), 
        
        search: (q, genreId = null, orderBy = null, page = 1) => {
            let url = `${BASE}/anime?sfw&page=${page}`;
            if (q) url += `&q=${q}`;
            if (genreId) url += `&genres=${genreId}`;
            if (orderBy) url += `&order_by=${orderBy}&sort=desc`;
            return axios.get(url);
        },
        getGenres: () => axios.get(`${BASE}/genres/anime`),
    },

    // --- MOVIES ---
    movies: {
        getTop: () => axios.get(`${BASE}/top/anime?type=movie&filter=bypopularity`),
        search: (genreId = null, orderBy = 'members', page = 1) => {
            let url = `${BASE}/anime?type=movie&sfw&page=${page}`;
            if (genreId) url += `&genres=${genreId}`;
            if (orderBy) url += `&order_by=${orderBy}&sort=desc`;
            return axios.get(url);
        }
    },

    // --- MANGA ---
    manga: {
        getTop: () => axios.get(`${BASE}/top/manga?filter=bypopularity`), // Updated to popularity
        getDetails: (id) => axios.get(`${BASE}/manga/${id}/full`),
        getCharacters: (id) => axios.get(`${BASE}/manga/${id}/characters`),
        getRelations: (id) => axios.get(`${BASE}/manga/${id}/relations`),
        
        search: (q, genreId = null, orderBy = null, page = 1) => {
            let url = `${BASE}/manga?sfw&page=${page}`;
            if (q) url += `&q=${q}`;
            if (genreId) url += `&genres=${genreId}`;
            if (orderBy) url += `&order_by=${orderBy}&sort=desc`;
            return axios.get(url);
        },
        getGenres: () => axios.get(`${BASE}/genres/manga`),
    },

    // --- TOP / TRENDING ---
    top: {
        getAnime: () => axios.get(`${BASE}/top/anime?filter=bypopularity`), // Fallback popular list
        getCharacters: () => axios.get(`${BASE}/top/characters`),
    },

    // --- SEASONS ---
    seasons: {
        getNow: () => axios.get(`${BASE}/seasons/now`),
    }
};