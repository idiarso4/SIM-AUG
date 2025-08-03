const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api';
let authToken = '';

async function testAllEndpoints() {
    console.log('🧪 TESTING ALL SIMS ENDPOINTS\n');
    
    try {
        // 1. Login first to get token
        console.log('🔐 Logging in...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            username: 'admintest',
            password: 'NewAdmin123!'
        });
        authToken = loginResponse.data.token;
        console.log('✅ Login successful\n');

        // Headers with auth token
        const headers = { Authorization: `Bearer ${authToken}` };

        // 2. Test Users endpoints
        console.log('👥 Testing Users endpoints...');
        
        // Get all users
        const usersResponse = await axios.get(`${BASE_URL}/users`, { headers });
        console.log(`✅ GET /users - Found ${usersResponse.data.users.length} users`);

        // Create a new user with timestamp to ensure uniqueness
        const timestamp = Date.now();
        const newUserData = {
            username: `teacher${timestamp}`,
            email: `teacher${timestamp}@sims.test`,
            password: 'Teacher123!',
            role: 'teacher',
            firstName: 'John',
            lastName: 'Teacher',
            phoneNumber: '+6281234567891'
        };
        
        const createUserResponse = await axios.post(`${BASE_URL}/users`, newUserData, { headers });
        console.log('✅ POST /users - User created successfully');
        const newUserId = createUserResponse.data.user._id;

        // Get user by ID
        const userByIdResponse = await axios.get(`${BASE_URL}/users/${newUserId}`, { headers });
        console.log('✅ GET /users/:id - User retrieved successfully');

        // Update user
        const updateUserData = { firstName: 'Jane', lastName: 'Teacher Updated' };
        await axios.put(`${BASE_URL}/users/${newUserId}`, updateUserData, { headers });
        console.log('✅ PUT /users/:id - User updated successfully\n');

        // 3. Test Students endpoints
        console.log('🎓 Testing Students endpoints...');
        
        // Get all students
        const studentsResponse = await axios.get(`${BASE_URL}/students`, { headers });
        console.log(`✅ GET /students - Found ${studentsResponse.data.students.length} students`);

        // Create a new student
        const newStudentData = {
            user: newUserId,
            dateOfBirth: '2005-01-15',
            gender: 'male',
            religion: 'Islam',
            emergencyContact: {
                name: 'Parent Name',
                relationship: 'Father',
                phoneNumber: '+6281234567892'
            }
        };
        
        const createStudentResponse = await axios.post(`${BASE_URL}/students`, newStudentData, { headers });
        console.log('✅ POST /students - Student created successfully');
        const newStudentId = createStudentResponse.data.student._id;

        // Get student by ID
        await axios.get(`${BASE_URL}/students/${newStudentId}`, { headers });
        console.log('✅ GET /students/:id - Student retrieved successfully\n');

        // 4. Test Teachers endpoints
        console.log('👨‍🏫 Testing Teachers endpoints...');
        
        // Get all teachers
        const teachersResponse = await axios.get(`${BASE_URL}/teachers`, { headers });
        console.log(`✅ GET /teachers - Found ${teachersResponse.data.teachers.length} teachers`);

        // Create a new teacher
        const newTeacherData = {
            user: newUserId,
            dateOfHire: '2024-01-01',
            qualification: 'S1 Mathematics'
        };
        
        const createTeacherResponse = await axios.post(`${BASE_URL}/teachers`, newTeacherData, { headers });
        console.log('✅ POST /teachers - Teacher created successfully');
        const newTeacherId = createTeacherResponse.data.teacher._id;

        // Get teacher by ID
        await axios.get(`${BASE_URL}/teachers/${newTeacherId}`, { headers });
        console.log('✅ GET /teachers/:id - Teacher retrieved successfully\n');

        // 5. Test Subjects endpoints
        console.log('📚 Testing Subjects endpoints...');
        
        // Get all subjects
        const subjectsResponse = await axios.get(`${BASE_URL}/subjects`, { headers });
        console.log(`✅ GET /subjects - Found ${subjectsResponse.data.subjects.length} subjects`);

        // Create a new subject
        const newSubjectData = {
            subjectCode: 'MATH101',
            subjectName: 'Mathematics Basics',
            credits: 3,
            category: 'core',
            grades: ['10', '11', '12']
        };
        
        const createSubjectResponse = await axios.post(`${BASE_URL}/subjects`, newSubjectData, { headers });
        console.log('✅ POST /subjects - Subject created successfully');
        const newSubjectId = createSubjectResponse.data.subject._id;

        // Get subject by ID
        await axios.get(`${BASE_URL}/subjects/${newSubjectId}`, { headers });
        console.log('✅ GET /subjects/:id - Subject retrieved successfully\n');

        // 6. Test Classes endpoints
        console.log('🏫 Testing Classes endpoints...');
        
        // Get all classes
        const classesResponse = await axios.get(`${BASE_URL}/classes`, { headers });
        console.log(`✅ GET /classes - Found ${classesResponse.data.classes.length} classes`);

        // Create a new class
        const newClassData = {
            className: 'X-A',
            grade: '10',
            section: 'A',
            academicYear: '2024-2025',
            room: 'Room 101'
        };
        
        const createClassResponse = await axios.post(`${BASE_URL}/classes`, newClassData, { headers });
        console.log('✅ POST /classes - Class created successfully');
        const newClassId = createClassResponse.data.class._id;

        // Get class by ID
        await axios.get(`${BASE_URL}/classes/${newClassId}`, { headers });
        console.log('✅ GET /classes/:id - Class retrieved successfully\n');

        console.log('🎉 ALL ENDPOINT TESTS PASSED!');
        console.log('🚀 All CRUD operations working correctly!');

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

testAllEndpoints();
