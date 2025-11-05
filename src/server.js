require('dotenv').config();  // Load environment variables from .env

const express = require('express');
const {connectDB} = require('./config/db');  // Import connectDB function

const app = require("./app")





// Connect to the database
connectDB(process.env.MONGO_URI);


// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});




