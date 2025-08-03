const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const auth = async (req, res, next) => {
    // Jika request OPTIONS, langsung next agar CORS preflight tidak dihalangi
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

// Removed demo token handling

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Token is not valid or user is inactive' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Check if user has required role
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authorization required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Role ${req.user.role} is not authorized to access this resource` 
            });
        }

        next();
    };
};

// Check if user is admin or super admin
const isAdmin = authorize('admin', 'super_admin');

// Check if user is teacher
const isTeacher = authorize('teacher', 'admin', 'super_admin');

// Check if user is student
const isStudent = authorize('student', 'admin', 'super_admin');

// Check if user can manage users
const canManageUsers = authorize('admin', 'super_admin');

module.exports = {
    auth,
    authorize,
    isAdmin,
    isTeacher,
    isStudent,
    canManageUsers
};
