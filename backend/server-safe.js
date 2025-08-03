const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        routes: [
            'GET /',
            'GET /api/test',
            'POST /api/auth/register',
            'POST /api/auth/login',
            'GET /api/auth/me'
        ]
    });
});

// Safe route loading with error handling
const loadRoutes = () => {
    try {
        // Auth routes
        const authRoutes = require('./routes/auth');
        app.use('/api/auth', authRoutes);
        console.log('✅ Auth routes loaded');
    } catch (error) {
        console.error('❌ Error loading auth routes:', error.message);
    }

    try {
        // Users routes
        const userRoutes = require('./routes/users');
        app.use('/api/users', userRoutes);
        console.log('✅ Users routes loaded');
    } catch (error) {
        console.error('❌ Error loading users routes:', error.message);
    }

    try {
        // Students routes
        const studentRoutes = require('./routes/students');
        app.use('/api/students', studentRoutes);
        console.log('✅ Students routes loaded');
    } catch (error) {
        console.error('❌ Error loading students routes:', error.message);
    }

    try {
        // Teachers routes
        const teacherRoutes = require('./routes/teachers');
        app.use('/api/teachers', teacherRoutes);
        console.log('✅ Teachers routes loaded');
    } catch (error) {
        console.error('❌ Error loading teachers routes:', error.message);
    }

    try {
        // Classes routes
        const classRoutes = require('./routes/classes');
        app.use('/api/classes', classRoutes);
        console.log('✅ Classes routes loaded');
    } catch (error) {
        console.error('❌ Error loading classes routes:', error.message);
    }

    try {
        // Subjects routes
        const subjectRoutes = require('./routes/subjects');
        app.use('/api/subjects', subjectRoutes);
        console.log('✅ Subjects routes loaded');
    } catch (error) {
        console.error('❌ Error loading subjects routes:', error.message);
    }

    try {
        // Grades routes
        const gradeRoutes = require('./routes/grades');
        app.use('/api/grades', gradeRoutes);
        console.log('✅ Grades routes loaded');
    } catch (error) {
        console.error('❌ Error loading grades routes:', error.message);
    }

    try {
        // Attendance routes
        const attendanceRoutes = require('./routes/attendance');
        app.use('/api/attendance', attendanceRoutes);
        console.log('✅ Attendance routes loaded');
    } catch (error) {
        console.error('❌ Error loading attendance routes:', error.message);
    }

    try {
        // Announcements routes
        const announcementRoutes = require('./routes/announcements');
        app.use('/api/announcements', announcementRoutes);
        console.log('✅ Announcements routes loaded');
    } catch (error) {
        console.error('❌ Error loading announcements routes:', error.message);
    }
};

// Load routes
loadRoutes();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!', 
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        message: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});

const PORT = process.env.PORT || 3002;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌐 Visit: http://localhost:${PORT}`);
        console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
        console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/`);
    });
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});
