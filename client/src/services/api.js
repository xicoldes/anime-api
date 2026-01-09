import axios from 'axios';

const BASE = "https://api.jikan.moe/v4";

export const api = {
    // --- ANIME ---
    anime: {
        getSpotlight: async () => {
             const { data } = await axios.get(`${BASE}/seasons/now?filter=tv&sfw&limit=10`);
             return data.data; 
        },
        getFull: (id) => axios.get(`${BASE}/anime/${id}/full`),
        getCharacters: (id) => axios.get(`${BASE}/anime/${id}/characters`),
        getStaff: (id) => axios.get(`${BASE}/anime/${id}/staff`),
        getEpisodes: (id) => axios.get(`${BASE}/anime/${id}/episodes`),
        getRelations: (id) => axios.get(`${BASE}/anime/${id}/relations`), 
        
        search: (q, genreId = null, orderBy = null, sort = 'desc') => {
            let url = `${BASE}/anime?sfw`;
            if (q) url += `&q=${q}`;
            if (genreId) url += `&genres=${genreId}`;
            if (orderBy) url += `&order_by=${orderBy}&sort=${sort}`;
            return axios.get(url);
        },
        getGenres: () => axios.get(`${BASE}/genres/anime`),
    },

    // --- MOVIES ---
    movies: {
        getTop: () => axios.get(`${BASE}/top/anime?type=movie&filter=bypopularity`),
        search: (genreId = null, orderBy = 'members') => {
            let url = `${BASE}/anime?type=movie&sfw`;
            if (genreId) url += `&genres=${genreId}`;
            if (orderBy) url += `&order_by=${orderBy}&sort=desc`;
            return axios.get(url);
        }
    },

    // --- MANGA ---
    manga: {
        getTop: () => axios.get(`${BASE}/top/manga`),
        getDetails: (id) => axios.get(`${BASE}/manga/${id}/full`),
        getCharacters: (id) => axios.get(`${BASE}/manga/${id}/characters`),
        getRelations: (id) => axios.get(`${BASE}/manga/${id}/relations`),
        
        // FIXED: Manga Search
        search: (q, genreId = null, orderBy = null, sort = 'desc') => {
            let url = `${BASE}/manga?sfw`;
            if (q) url += `&q=${q}`;
            if (genreId) url += `&genres=${genreId}`;
            if (orderBy) url += `&order_by=${orderBy}&sort=${sort}`;
            return axios.get(url);
        },
        getGenres: () => axios.get(`${BASE}/genres/manga`),
    },

    // --- TOP / TRENDING ---
    top: {
        getAnime: () => axios.get(`${BASE}/top/anime?filter=airing`),
        getCharacters: () => axios.get(`${BASE}/top/characters`),
    },

    // --- SEASONS ---
    seasons: {
        getNow: () => axios.get(`${BASE}/seasons/now`),
    }
};