import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import router from './routes/index.js';
import db from './config/database.js';
import { User, Note } from './models/index.js';

dotenv.config();

const app = express();

// Middleware
// Ganti bagian CORS dengan ini:
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500'], // Tambahkan port Live Server
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api', router);

// Error handling
// Tambahkan error handler ini sebelum startServer
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({ errors });
  }
  
  // Handle Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ 
      error: 'Data sudah ada',
      field: err.errors[0].path,
      message: err.errors[0].message
    });
  }
  
  res.status(500).json({ 
    error: "Terjadi kesalahan pada server",
    detail: process.env.NODE_ENV === 'development' ? err.message : null
  });
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // Test connection
    await db.authenticate();
    console.log('✅ Database connected');

    // Sync models
    await User.sync({ alter: true });
    await Note.sync({ alter: true });
    console.log('✅ Models synchronized');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();