const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
    res.json({ 
        message: 'SIMS API is running!', 
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'API Test successful!',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌐 Visit: http://localhost:${PORT}`);
        console.log(`🌐 Visit: http://127.0.0.1:${PORT}`);
        console.log(`🧪 Test API: http://localhost:${PORT}/api/test`);
        console.log(`🧪 Test API: http://127.0.0.1:${PORT}/api/test`);
    });
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});
