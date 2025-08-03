const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Grade = require('../models/Grade');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Clear all data from database
const clearAllData = async (req, res) => {
    try {
        console.log('Starting data clearing process...');
        
        // Clear all collections except the current admin user
        const currentUserId = req.user?.id;
        
        await Promise.all([
            Student.deleteMany({}),
            Teacher.deleteMany({}),
            Class.deleteMany({}),
            Subject.deleteMany({}),
            Grade.deleteMany({}),
            // Keep current admin user, delete others
            User.deleteMany({ _id: { $ne: currentUserId } })
        ]);

        console.log('All data cleared successfully');
        
        res.json({
            success: true,
            message: 'Semua data berhasil dihapus',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error clearing data:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus data',
            error: error.message
        });
    }
};

// Load sample data
const loadSampleData = async (req, res) => {
    try {
        console.log('Starting sample data loading process...');
        
        // Sample Subjects
        const sampleSubjects = [
            { name: 'Matematika', code: 'MTK', description: 'Mata pelajaran Matematika' },
            { name: 'Bahasa Indonesia', code: 'BIN', description: 'Mata pelajaran Bahasa Indonesia' },
            { name: 'Bahasa Inggris', code: 'BIG', description: 'Mata pelajaran Bahasa Inggris' },
            { name: 'Fisika', code: 'FIS', description: 'Mata pelajaran Fisika' },
            { name: 'Kimia', code: 'KIM', description: 'Mata pelajaran Kimia' },
            { name: 'Biologi', code: 'BIO', description: 'Mata pelajaran Biologi' },
            { name: 'Sejarah', code: 'SEJ', description: 'Mata pelajaran Sejarah' },
            { name: 'Geografi', code: 'GEO', description: 'Mata pelajaran Geografi' },
            { name: 'Ekonomi', code: 'EKO', description: 'Mata pelajaran Ekonomi' },
            { name: 'Sosiologi', code: 'SOS', description: 'Mata pelajaran Sosiologi' },
            { name: 'Pendidikan Jasmani', code: 'PJK', description: 'Mata pelajaran Pendidikan Jasmani' },
            { name: 'Pendidikan Agama', code: 'PAI', description: 'Mata pelajaran Pendidikan Agama Islam' }
        ];

        const subjects = await Subject.insertMany(sampleSubjects);
        console.log(`Created ${subjects.length} subjects`);

        // Sample Classes
        const sampleClasses = [
            { name: 'X-A', grade: 10, academicYear: '2023/2024' },
            { name: 'X-B', grade: 10, academicYear: '2023/2024' },
            { name: 'XI-IPA', grade: 11, academicYear: '2023/2024' },
            { name: 'XI-IPS', grade: 11, academicYear: '2023/2024' },
            { name: 'XI-Bahasa', grade: 11, academicYear: '2023/2024' },
            { name: 'XII-IPA', grade: 12, academicYear: '2023/2024' },
            { name: 'XII-IPS', grade: 12, academicYear: '2023/2024' },
            { name: 'XII-Bahasa', grade: 12, academicYear: '2023/2024' }
        ];

        const classes = await Class.insertMany(sampleClasses);
        console.log(`Created ${classes.length} classes`);

        // Sample Teachers
        const sampleTeachers = [
            {
                nip: '196801011992031001',
                name: 'Dr. Ahmad Susanto, S.Pd., M.Pd.',
                email: 'ahmad.susanto@sman1jakarta.sch.id',
                phone: '081234567890',
                address: 'Jl. Pendidikan No. 45, Jakarta Selatan',
                dateOfBirth: new Date('1968-01-01'),
                subjects: [subjects.find(s => s.name === 'Matematika')?._id],
                classes: [classes.find(c => c.name === 'X-A')?._id, classes.find(c => c.name === 'XI-IPA')?._id]
            },
            {
                nip: '197203151998022001',
                name: 'Dra. Siti Nurhaliza, M.Pd.',
                email: 'siti.nurhaliza@sman1jakarta.sch.id',
                phone: '081234567891',
                address: 'Jl. Mawar No. 12, Jakarta Timur',
                dateOfBirth: new Date('1972-03-15'),
                subjects: [subjects.find(s => s.name === 'Bahasa Indonesia')?._id],
                classes: [classes.find(c => c.name === 'X-B')?._id, classes.find(c => c.name === 'XI-IPS')?._id]
            },
            {
                nip: '198405102009121002',
                name: 'Budi Hartono, S.Pd., M.Sc.',
                email: 'budi.hartono@sman1jakarta.sch.id',
                phone: '081234567892',
                address: 'Jl. Melati No. 78, Jakarta Barat',
                dateOfBirth: new Date('1984-05-10'),
                subjects: [subjects.find(s => s.name === 'Bahasa Inggris')?._id],
                classes: [classes.find(c => c.name === 'XII-IPA')?._id, classes.find(c => c.name === 'XII-IPS')?._id]
            },
            {
                nip: '198712252012011003',
                name: 'Dr. Andi Wijaya, S.Si., M.Si.',
                email: 'andi.wijaya@sman1jakarta.sch.id',
                phone: '081234567893',
                address: 'Jl. Kenanga No. 23, Jakarta Utara',
                dateOfBirth: new Date('1987-12-25'),
                subjects: [subjects.find(s => s.name === 'Fisika')?._id],
                classes: [classes.find(c => c.name === 'XI-IPA')?._id, classes.find(c => c.name === 'XII-IPA')?._id]
            },
            {
                nip: '199002142015031004',
                name: 'Maya Sari, S.Pd., M.Pd.',
                email: 'maya.sari@sman1jakarta.sch.id',
                phone: '081234567894',
                address: 'Jl. Anggrek No. 56, Jakarta Selatan',
                dateOfBirth: new Date('1990-02-14'),
                subjects: [subjects.find(s => s.name === 'Kimia')?._id],
                classes: [classes.find(c => c.name === 'XI-IPA')?._id, classes.find(c => c.name === 'XII-IPA')?._id]
            },
            {
                nip: '198509082010122005',
                name: 'Dr. Ratna Dewi, S.Si., M.Si.',
                email: 'ratna.dewi@sman1jakarta.sch.id',
                phone: '081234567895',
                address: 'Jl. Dahlia No. 34, Jakarta Timur',
                dateOfBirth: new Date('1985-09-08'),
                subjects: [subjects.find(s => s.name === 'Biologi')?._id],
                classes: [classes.find(c => c.name === 'XI-IPA')?._id, classes.find(c => c.name === 'XII-IPA')?._id]
            },
            {
                nip: '197804201999031006',
                name: 'Drs. Bambang Sutrisno, M.Pd.',
                email: 'bambang.sutrisno@sman1jakarta.sch.id',
                phone: '081234567896',
                address: 'Jl. Cempaka No. 67, Jakarta Barat',
                dateOfBirth: new Date('1978-04-20'),
                subjects: [subjects.find(s => s.name === 'Sejarah')?._id],
                classes: [classes.find(c => c.name === 'XI-IPS')?._id, classes.find(c => c.name === 'XII-IPS')?._id]
            },
            {
                nip: '198306152008012007',
                name: 'Linda Pratiwi, S.Pd., M.Pd.',
                email: 'linda.pratiwi@sman1jakarta.sch.id',
                phone: '081234567897',
                address: 'Jl. Flamboyan No. 89, Jakarta Utara',
                dateOfBirth: new Date('1983-06-15'),
                subjects: [subjects.find(s => s.name === 'Geografi')?._id],
                classes: [classes.find(c => c.name === 'XI-IPS')?._id, classes.find(c => c.name === 'XII-IPS')?._id]
            },
            {
                nip: '199107302016021008',
                name: 'Hendra Gunawan, S.E., M.Pd.',
                email: 'hendra.gunawan@sman1jakarta.sch.id',
                phone: '081234567898',
                address: 'Jl. Tulip No. 12, Jakarta Selatan',
                dateOfBirth: new Date('1991-07-30'),
                subjects: [subjects.find(s => s.name === 'Ekonomi')?._id],
                classes: [classes.find(c => c.name === 'XI-IPS')?._id, classes.find(c => c.name === 'XII-IPS')?._id]
            },
            {
                nip: '198811122013032009',
                name: 'Dewi Kartika, S.Sos., M.Pd.',
                email: 'dewi.kartika@sman1jakarta.sch.id',
                phone: '081234567899',
                address: 'Jl. Sakura No. 45, Jakarta Timur',
                dateOfBirth: new Date('1988-11-12'),
                subjects: [subjects.find(s => s.name === 'Sosiologi')?._id],
                classes: [classes.find(c => c.name === 'XI-IPS')?._id, classes.find(c => c.name === 'XII-IPS')?._id]
            }
        ];

        const teachers = await Teacher.insertMany(sampleTeachers);
        console.log(`Created ${teachers.length} teachers`);

        // Generate sample students
        const firstNames = [
            'Adi', 'Ani', 'Budi', 'Citra', 'Dani', 'Eka', 'Fajar', 'Gita', 'Hani', 'Indra',
            'Joko', 'Kiki', 'Lina', 'Maya', 'Nina', 'Oki', 'Putri', 'Qori', 'Rina', 'Sari',
            'Toni', 'Usman', 'Vina', 'Wati', 'Yoga', 'Zaki', 'Ayu', 'Bayu', 'Caca', 'Dede'
        ];
        
        const lastNames = [
            'Pratama', 'Sari', 'Wijaya', 'Putri', 'Santoso', 'Dewi', 'Gunawan', 'Lestari',
            'Setiawan', 'Rahayu', 'Hartono', 'Safitri', 'Nugroho', 'Wulandari', 'Susanto',
            'Anggraini', 'Hidayat', 'Maharani', 'Kurniawan', 'Permata', 'Hakim', 'Indah'
        ];

        const sampleStudents = [];
        let studentCounter = 1;

        for (let classData of classes) {
            const studentsPerClass = Math.floor(Math.random() * 10) + 15; // 15-25 students per class
            
            for (let i = 0; i < studentsPerClass; i++) {
                const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                const fullName = `${firstName} ${lastName}`;
                
                // Generate NIS (Nomor Induk Siswa)
                const nis = `2023${String(studentCounter).padStart(4, '0')}`;
                
                // Generate realistic birth date based on grade
                const currentYear = 2024;
                const expectedAge = 15 + (classData.grade - 10); // Age based on grade
                const birthYear = currentYear - expectedAge;
                const birthMonth = Math.floor(Math.random() * 12) + 1;
                const birthDay = Math.floor(Math.random() * 28) + 1;
                
                sampleStudents.push({
                    nis: nis,
                    name: fullName,
                    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${studentCounter}@gmail.com`,
                    phone: `0812345${String(studentCounter).padStart(5, '0')}`,
                    address: `Jl. Contoh No. ${Math.floor(Math.random() * 100) + 1}, Jakarta`,
                    dateOfBirth: new Date(birthYear, birthMonth - 1, birthDay),
                    gender: Math.random() > 0.5 ? 'L' : 'P',
                    class: classData._id,
                    parentName: `Orang Tua ${fullName}`,
                    parentPhone: `0813456${String(studentCounter).padStart(5, '0')}`,
                    enrollmentYear: 2023,
                    status: 'active'
                });
                
                studentCounter++;
            }
        }

        const students = await Student.insertMany(sampleStudents);
        console.log(`Created ${students.length} students`);

        // Update classes with student counts and homeroom teachers
        for (let i = 0; i < classes.length; i++) {
            const classStudents = students.filter(s => s.class.toString() === classes[i]._id.toString());
            const homeroomTeacher = teachers[Math.floor(Math.random() * teachers.length)];
            
            await Class.findByIdAndUpdate(classes[i]._id, {
                students: classStudents.map(s => s._id),
                homeroomTeacher: homeroomTeacher._id,
                capacity: classStudents.length + 5 // Add some extra capacity
            });
        }

        // Generate sample grades
        const sampleGrades = [];
        for (let student of students) {
            // Get student's class subjects
            const studentClass = classes.find(c => c._id.toString() === student.class.toString());
            const classTeachers = teachers.filter(t => 
                t.classes.some(tc => tc.toString() === studentClass._id.toString())
            );
            
            for (let teacher of classTeachers) {
                for (let subjectId of teacher.subjects) {
                    // Generate grades for different assessment types
                    const assessmentTypes = ['UH1', 'UH2', 'UTS', 'UAS', 'Tugas'];
                    
                    for (let assessmentType of assessmentTypes) {
                        const score = Math.floor(Math.random() * 30) + 70; // Score between 70-100
                        
                        sampleGrades.push({
                            student: student._id,
                            subject: subjectId,
                            teacher: teacher._id,
                            class: student.class,
                            assessmentType: assessmentType,
                            score: score,
                            maxScore: 100,
                            date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
                            semester: 'Ganjil',
                            academicYear: '2023/2024'
                        });
                    }
                }
            }
        }

        const grades = await Grade.insertMany(sampleGrades);
        console.log(`Created ${grades.length} grades`);

        // Create sample teacher users
        const teacherUsers = [];
        for (let teacher of teachers.slice(0, 5)) { // Create users for first 5 teachers
            const hashedPassword = await bcrypt.hash('password123', 10);
            teacherUsers.push({
                username: teacher.nip,
                email: teacher.email,
                password: hashedPassword,
                name: teacher.name,
                role: 'teacher',
                teacherId: teacher._id
            });
        }

        await User.insertMany(teacherUsers);
        console.log(`Created ${teacherUsers.length} teacher users`);

        const summary = {
            subjects: subjects.length,
            classes: classes.length,
            teachers: teachers.length,
            students: students.length,
            grades: grades.length,
            teacherUsers: teacherUsers.length
        };

        console.log('Sample data loaded successfully:', summary);
        
        res.json({
            success: true,
            message: 'Data sampel berhasil dimuat',
            data: summary,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error loading sample data:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal memuat data sampel',
            error: error.message
        });
    }
};

// Get database statistics
const getDatabaseStats = async (req, res) => {
    try {
        const stats = await Promise.all([
            Student.countDocuments(),
            Teacher.countDocuments(),
            Class.countDocuments(),
            Subject.countDocuments(),
            Grade.countDocuments(),
            User.countDocuments()
        ]);

        const [studentCount, teacherCount, classCount, subjectCount, gradeCount, userCount] = stats;

        res.json({
            success: true,
            data: {
                students: studentCount,
                teachers: teacherCount,
                classes: classCount,
                subjects: subjectCount,
                grades: gradeCount,
                users: userCount,
                total: studentCount + teacherCount + classCount + subjectCount + gradeCount + userCount
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error getting database stats:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil statistik database',
            error: error.message
        });
    }
};

module.exports = {
    clearAllData,
    loadSampleData,
    getDatabaseStats
};
