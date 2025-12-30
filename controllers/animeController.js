const jikanjs = require('@mateoaranda/jikanjs');

// Simple wrapper to search anime using backend
const searchAnime = async (req, res) => {
    const query = req.query.q;
    try {
        const result = await jikanjs.search('anime', query, 10);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
};

module.exports = { searchAnime };