import axios from 'axios';

const BASE = "https://api.jikan.moe/v4";

// Helper to handle rate limits
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    // --- ANIME ---
    anime: {
        // We now return the full list for the slider
        getSpotlight: async () => {
             const { data } = await axios.get(`${BASE}/top/anime?filter=bypopularity&limit=10`);
             return data.data; 
        },
        getFull: (id) => axios.get(`${BASE}/anime/${id}/full`),
        getCharacters: (id) => axios.get(`${BASE}/anime/${id}/characters`), // New Endpoint
        getStaff: (id) => axios.get(`${BASE}/anime/${id}/staff`),
        getEpisodes: (id) => axios.get(`${BASE}/anime/${id}/episodes`),
        search: (q) => axios.get(`${BASE}/anime?q=${q}`),
    },

    // --- MANGA (New) ---
    manga: {
        getTop: () => axios.get(`${BASE}/top/manga`),
        getDetails: (id) => axios.get(`${BASE}/manga/${id}/full`),
        search: (q) => axios.get(`${BASE}/manga?q=${q}`),
    },

    // --- TOP / TRENDING ---
    top: {
        getAnime: () => axios.get(`${BASE}/top/anime`),
        getCharacters: () => axios.get(`${BASE}/top/characters`),
    },

    // --- SEASONS ---
    seasons: {
        getNow: () => axios.get(`${BASE}/seasons/now`),
    }
};