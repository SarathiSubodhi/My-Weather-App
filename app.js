const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');
const app = express();

// Middleware
app.use(express.json());

// Import Routes
const userRoutes = require('./routes/userRoutes');

// Use Routes
app.use('/users', userRoutes);

// Database Connection
mongoose.connect(config.dbUri, {
 
}).then(() => {
  console.log('Connected to the database');
}).catch((err) => {
  console.error('Database connection error:', err);
});

// Start Server
app.listen(config.port, () => {
  console.log(`Server running at http://localhost:3000`);
});
