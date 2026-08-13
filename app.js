const express = require('express');
const cors = require('cors');
const animeRoutes = require('./routes/animeRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', animeRoutes);

// Only listen on the port if we are running the actual app, NOT during Jest tests
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Backend Server running on http://localhost:${PORT}`);
    });
}

// Export the app for Supertest to use
module.exports = app;