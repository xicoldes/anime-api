const axios = require('axios');

const animeLogic = {
    async processAnimeData(id) {
        console.log(`Processing anime ID: ${id}`);
        try {
            const response = await axios.get(`https://api.tenrai.org/v1/anime/${id}`);
            if (!response.data || !response.data.data) throw new Error("No data");
            
            return {
                title: response.data.data.title,
                isPopular: response.data.data.popularity < 1000,
                processed: true
            };
        } catch (error) {
            return { error: "Invalid ID or API Error" };
        }
    }
};

module.exports = animeLogic;