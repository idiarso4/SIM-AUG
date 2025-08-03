const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api';

// Test data
const testUser = {
    username: 'admintest',
    email: 'admin@sims.test',
    password: 'Admin123!',
    role: 'super_admin',
    firstName: 'Super',
    lastName: 'Admin',
    phoneNumber: '+6281234567890',
    address: 'Jakarta, Indonesia'
};

let authToken = '';

async function testAuth() {
    console.log('🧪 TESTING AUTHENTICATION ENDPOINTS\n');

    try {
        // 1. Test Health Check
        console.log('1️⃣ Testing Health Check...');
        const health = await axios.get(`${BASE_URL.replace('/api', '')}/`);
        console.log('✅ Health Check:', health.data.message);
        console.log('📊 Database Status:', health.data.database);
        console.log();

        // 2. Test Register
        console.log('2️⃣ Testing User Registration...');
        const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
        console.log('✅ Registration successful!');
        console.log('👤 User:', registerResponse.data.user.username);
        console.log('🔑 Token received:', registerResponse.data.token ? 'Yes' : 'No');
        authToken = registerResponse.data.token;
        console.log();

        // 3. Test Login
        console.log('3️⃣ Testing User Login...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            username: testUser.username,
            password: testUser.password
        });
        console.log('✅ Login successful!');
        console.log('👤 User:', loginResponse.data.user.fullName);
        console.log('🔑 New Token received:', loginResponse.data.token ? 'Yes' : 'No');
        authToken = loginResponse.data.token;
        console.log();

        // 4. Test Get Current User
        console.log('4️⃣ Testing Get Current User...');
        const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Get current user successful!');
        console.log('👤 User:', meResponse.data.user.fullName);
        console.log('📧 Email:', meResponse.data.user.email);
        console.log('🎭 Role:', meResponse.data.user.role);
        console.log();

        // 5. Test Update Profile
        console.log('5️⃣ Testing Update Profile...');
        const updateResponse = await axios.put(`${BASE_URL}/auth/profile`, {
            firstName: 'Super Updated',
            lastName: 'Admin Updated',
            phoneNumber: '+6281234567891',
            address: 'Jakarta Updated, Indonesia'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Profile update successful!');
        console.log('👤 Updated Name:', updateResponse.data.user.fullName);
        console.log();

        // 6. Test Change Password
        console.log('6️⃣ Testing Change Password...');
        const passwordResponse = await axios.put(`${BASE_URL}/auth/change-password`, {
            currentPassword: testUser.password,
            newPassword: 'NewAdmin123!'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Password change successful!');
        console.log('💬 Message:', passwordResponse.data.message);
        console.log();

        // 7. Test Login with New Password
        console.log('7️⃣ Testing Login with New Password...');
        const newLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            username: testUser.username,
            password: 'NewAdmin123!'
        });
        console.log('✅ Login with new password successful!');
        console.log();

        console.log('🎉 ALL AUTHENTICATION TESTS PASSED!');
        console.log('🚀 Authentication system is working perfectly!');

    } catch (error) {
        console.error('❌ Test failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Error:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

// Install axios if not already installed
const { exec } = require('child_process');
exec('npm list axios', (error) => {
    if (error) {
        console.log('📦 Installing axios...');
        exec('npm install axios', (installError) => {
            if (installError) {
                console.error('Failed to install axios:', installError);
                return;
            }
            console.log('✅ Axios installed, running tests...\n');
            testAuth();
        });
    } else {
        testAuth();
    }
});
