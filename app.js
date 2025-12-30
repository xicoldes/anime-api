const express = require('express');
const cors = require('cors');
const animeRoutes = require('./routes/animeRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', animeRoutes);

app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
});