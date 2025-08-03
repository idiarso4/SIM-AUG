const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
    try {
        console.log('Testing MongoDB connection...');
        console.log('Connection string:', process.env.MONGODB_URI?.replace(/\/\/.*@/, '//[HIDDEN]@'));
        
        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('✅ Successfully connected to MongoDB Atlas!');
        console.log('Database:', mongoose.connection.db.databaseName);
        console.log('Host:', mongoose.connection.host);
        console.log('Port:', mongoose.connection.port);
        
        // Test basic operations
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        
        await mongoose.disconnect();
        console.log('✅ Connection test completed successfully!');
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:');
        console.error('Error:', error.message);
        
        if (error.message.includes('authentication failed')) {
            console.error('💡 Check your username and password in the connection string');
        }
        
        if (error.message.includes('network')) {
            console.error('💡 Check your network access settings in MongoDB Atlas');
        }
        
        process.exit(1);
    }
};

// Run the test if this file is executed directly
if (require.main === module) {
    testConnection();
}

module.exports = testConnection;
