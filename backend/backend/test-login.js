const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function testLogin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sims');
        console.log('Connected to MongoDB');

        // Find admin user
        const adminUser = await User.findOne({ username: 'admin' });
        console.log('Admin user found:', adminUser ? 'Yes' : 'No');
        
        if (adminUser) {
            console.log('Admin user details:');
            console.log('- Username:', adminUser.username);
            console.log('- Email:', adminUser.email);
            console.log('- Role:', adminUser.role);
            console.log('- isActive:', adminUser.isActive);
            console.log('- Password hash length:', adminUser.password.length);
            
            // Test password comparison
            const passwordMatch = await adminUser.comparePassword('admin123');
            console.log('Password "admin123" matches:', passwordMatch);
            
            // Test wrong password
            const wrongPasswordMatch = await adminUser.comparePassword('wrongpassword');
            console.log('Wrong password matches:', wrongPasswordMatch);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

testLogin();
