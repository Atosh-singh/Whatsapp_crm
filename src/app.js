const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes/index');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Serve static files (images, media files)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.send("✅ API is running...");
});

// Central Routes for the API
app.use('/api', routes);

// 404 fallback (optional)
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

module.exports = app;
