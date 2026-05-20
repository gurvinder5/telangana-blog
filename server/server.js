const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Setup CORS configuration to allow local frontend connection
app.use(cors({
  origin: '*', // Allows requests from all origins (can be restricted in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Setup Parsers for client JSON data and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require('path');

// Serve static assets from the React client build directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// Import and mount modular route systems
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Root status endpoint for api verification
app.get('/api/status', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Welcome to the Telangana Tourism Blog API Server!',
    status: 'Running'
  });
});

// Serve React app index.html for all non-API paths (supporting client-side Router)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../client/dist/index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

// Global 404 Route handler for unrecognized API paths
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API Endpoint not found.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'An internal server error occurred. Please contact the administrator.' 
  });
});

// Listen on configured port
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`  Telangana Tourism Blog Backend server running...`);
  console.log(`  Port: ${PORT}`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`===================================================`);
});
