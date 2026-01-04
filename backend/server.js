require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Course Management API is running',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

// Initialize database then start server
initDatabase().then(() => {
  // Routes - mounted after database is ready
  app.use('/api/auth/register', require('./routes/auth/register'));
  app.use('/api/auth/login', require('./routes/auth/login'));
  app.use('/api/courses', require('./routes/courses'));
  app.use('/api/course', require('./routes/courses'));

  // 404 handler - must be AFTER routes
  app.use((req, res, next) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint not found'
    });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

module.exports = app;
