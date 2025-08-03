const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// Tambahkan handler global untuk request OPTIONS dengan logging dan respon 204
app.options('*', cors(corsOptions), (req, res) => {
  console.log('OPTIONS request received for:', req.originalUrl);
  res.sendStatus(204);
});

// Middleware
app.use(helmet());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Health check route
app.get('/', (req, res) => {
    res.json({ 
        message: 'SIMS API is running!', 
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/students', require('./routes/students'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/grades', require('./routes/grades'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/permissions', require('./routes/permissions'));
app.use('/api/lesson-plans', require('./routes/lessonplans'));
app.use('/api/cbt', require('./routes/cbt'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/duty-teachers', require('./routes/dutyTeachers'));
app.use('/api/data', require('./routes/data'));
app.use('/api/reports', require('./routes/reports'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sims';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, 'localhost', () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
