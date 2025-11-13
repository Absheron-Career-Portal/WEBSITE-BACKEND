require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const routes = require('./routes');

connectDB();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: [
    'https://career.absheronport.az',
    'https://www.career.absheronport.az',
    'http://localhost:3000', // for local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static('uploads'));
app.use('/api', routes);

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Test route to verify CORS
app.get('/api/test-cors', (req, res) => {
  res.json({ message: 'CORS is working!', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});