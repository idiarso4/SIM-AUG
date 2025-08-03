const axios = require('axios');

async function testLoginAPI() {
    try {
        console.log('Testing login API...');
        
        const response = await axios.post('http://localhost:3002/api/auth/login', {
            username: 'admin',
            password: 'admin123'
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000
        });
        
        console.log('Login successful!');
        console.log('Status:', response.status);
        console.log('Response data:', response.data);
        
    } catch (error) {
        console.error('Login failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response data:', error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.message);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testLoginAPI();
