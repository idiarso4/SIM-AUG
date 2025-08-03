const mongoose = require('mongoose');
const dotenv = require('dotenv');
const LessonPlan = require('./models/LessonPlan');
const CBT = require('./models/CBT');
const Subject = require('./models/Subject');
const Class = require('./models/Class');
const Teacher = require('./models/Teacher');
const Student = require('./models/Student');
const User = require('./models/User');

dotenv.config();

async function seedDatabase() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sims');
        console.log('Connected to MongoDB');

        // Clear existing data
        console.log('Clearing existing data...');
        await LessonPlan.deleteMany({});
        await CBT.deleteMany({});
        console.log('Existing data cleared');

        // Create admin user if not exists
        let adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.log('Creating admin user...');
            adminUser = await User.create({
                username: 'admin',
                firstName: 'System',
                lastName: 'Administrator',
                email: 'admin@sekolah.ac.id',
                password: 'admin123',
                role: 'admin',
                phoneNumber: '081234567800',
                address: 'Sekolah Management System',
                isActive: true
            });
            console.log('Admin user created - Username: admin, Password: admin123');
        }

        // Check if we have subjects, classes, and teachers
        let subjects = await Subject.find().limit(5);
        let classes = await Class.find().limit(5);
        let teachers = await Teacher.find().limit(3);
        let users = await User.find({ role: 'teacher' }).limit(3);

        // If no data exists, create sample ones
        if (subjects.length === 0) {
            console.log('Creating sample subjects...');
            subjects = await Subject.insertMany([
                { 
                    subjectCode: 'MATH10', 
                    subjectName: 'Matematika', 
                    description: 'Mata pelajaran matematika untuk tingkat SMA',
                    credits: 4, 
                    category: 'core',
                    grades: ['10', '11', '12'],
                    department: 'Sains'
                },
                { 
                    subjectCode: 'BIO10', 
                    subjectName: 'Biologi', 
                    description: 'Mata pelajaran biologi untuk tingkat SMA',
                    credits: 3, 
                    category: 'core',
                    grades: ['10', '11', '12'],
                    department: 'Sains'
                },
                { 
                    subjectCode: 'CHEM10', 
                    subjectName: 'Kimia', 
                    description: 'Mata pelajaran kimia untuk tingkat SMA',
                    credits: 3, 
                    category: 'core',
                    grades: ['10', '11', '12'],
                    department: 'Sains'
                },
                { 
                    subjectCode: 'PHYS10', 
                    subjectName: 'Fisika', 
                    description: 'Mata pelajaran fisika untuk tingkat SMA',
                    credits: 3, 
                    category: 'core',
                    grades: ['10', '11', '12'],
                    department: 'Sains'
                },
                { 
                    subjectCode: 'IND10', 
                    subjectName: 'Bahasa Indonesia', 
                    description: 'Mata pelajaran bahasa Indonesia untuk tingkat SMA',
                    credits: 4, 
                    category: 'core',
                    grades: ['10', '11', '12'],
                    department: 'Bahasa'
                }
            ]);
        }

        if (classes.length === 0) {
            console.log('Creating sample classes...');
            classes = await Class.insertMany([
                { 
                    className: '10 IPA A', 
                    grade: '10', 
                    section: 'A', 
                    academicYear: '2024/2025',
                    maxCapacity: 32,
                    room: 'R101'
                },
                { 
                    className: '10 IPA B', 
                    grade: '10', 
                    section: 'B', 
                    academicYear: '2024/2025',
                    maxCapacity: 32,
                    room: 'R102'
                },
                { 
                    className: '11 IPA A', 
                    grade: '11', 
                    section: 'A', 
                    academicYear: '2024/2025',
                    maxCapacity: 30,
                    room: 'R201'
                },
                { 
                    className: '11 IPA B', 
                    grade: '11', 
                    section: 'B', 
                    academicYear: '2024/2025',
                    maxCapacity: 30,
                    room: 'R202'
                },
                { 
                    className: '12 IPA A', 
                    grade: '12', 
                    section: 'A', 
                    academicYear: '2024/2025',
                    maxCapacity: 28,
                    room: 'R301'
                }
            ]);
        }

        if (users.length === 0) {
            console.log('Creating sample users for teachers...');
            users = await User.insertMany([
                {
                    username: 'guru_math',
                    firstName: 'Budi',
                    lastName: 'Santoso',
                    email: 'budi.santoso@sekolah.ac.id',
                    password: 'password123',
                    role: 'teacher',
                    phoneNumber: '081234567890',
                    address: 'Jl. Pendidikan No. 123, Jakarta',
                    isActive: true
                },
                {
                    username: 'guru_bio',
                    firstName: 'Sari',
                    lastName: 'Dewi',
                    email: 'sari.dewi@sekolah.ac.id',
                    password: 'password123',
                    role: 'teacher',
                    phoneNumber: '081234567891',
                    address: 'Jl. Ilmu No. 456, Jakarta',
                    isActive: true
                },
                {
                    username: 'guru_chem',
                    firstName: 'Ahmad',
                    lastName: 'Wijaya',
                    email: 'ahmad.wijaya@sekolah.ac.id',
                    password: 'password123',
                    role: 'teacher',
                    phoneNumber: '081234567892',
                    address: 'Jl. Kimia No. 789, Jakarta',
                    isActive: true
                }
            ]);
        }

        if (teachers.length === 0) {
            console.log('Creating sample teachers...');
            teachers = await Teacher.insertMany([
                { 
                    teacherId: 'T20240001',
                    user: users[0]._id, 
                    employeeNumber: 'T202400001',
                    qualification: 'S.Pd Matematika', 
                    dateOfHire: new Date('2020-07-01'),
                    subjects: [subjects[0]._id],
                    classes: [classes[0]._id, classes[1]._id],
                    phoneNumber: '081234567890',
                    address: 'Jl. Pendidikan No. 123, Jakarta'
                },
                { 
                    teacherId: 'T20240002',
                    user: users[1]._id, 
                    employeeNumber: 'T202400002',
                    qualification: 'S.Pd Biologi', 
                    dateOfHire: new Date('2019-08-15'),
                    subjects: [subjects[1]._id],
                    classes: [classes[0]._id, classes[2]._id],
                    phoneNumber: '081234567891',
                    address: 'Jl. Ilmu No. 456, Jakarta'
                },
                { 
                    teacherId: 'T20240003',
                    user: users[2]._id, 
                    employeeNumber: 'T202400003',
                    qualification: 'M.Pd Kimia', 
                    dateOfHire: new Date('2018-01-10'),
                    subjects: [subjects[2]._id],
                    classes: [classes[1]._id, classes[3]._id],
                    phoneNumber: '081234567892',
                    address: 'Jl. Kimia No. 789, Jakarta'
                }
            ]);
        }

        // Create student users if not exists
        let studentUsers = await User.find({ role: 'student' }).limit(5);
        if (studentUsers.length === 0) {
            console.log('Creating sample student users...');
            studentUsers = await User.insertMany([
                {
                    username: 'ahmad.fauzi',
                    firstName: 'Ahmad',
                    lastName: 'Fauzi',
                    email: 'ahmad.fauzi@students.sekolah.ac.id',
                    password: 'student123',
                    role: 'student',
                    phoneNumber: '081234567801',
                    address: 'Jl. Merdeka No. 123, Jakarta',
                    isActive: true
                },
                {
                    username: 'siti.aminah',
                    firstName: 'Siti',
                    lastName: 'Aminah',
                    email: 'siti.aminah@students.sekolah.ac.id',
                    password: 'student123',
                    role: 'student',
                    phoneNumber: '081234567802',
                    address: 'Jl. Proklamasi No. 45, Jakarta',
                    isActive: true
                },
                {
                    username: 'rudi.hartono',
                    firstName: 'Rudi',
                    lastName: 'Hartono',
                    email: 'rudi.hartono@students.sekolah.ac.id',
                    password: 'student123',
                    role: 'student',
                    phoneNumber: '081234567803',
                    address: 'Jl. Sudirman No. 78, Jakarta',
                    isActive: true
                },
                {
                    username: 'dewi.sari',
                    firstName: 'Dewi',
                    lastName: 'Sari',
                    email: 'dewi.sari@students.sekolah.ac.id',
                    password: 'student123',
                    role: 'student',
                    phoneNumber: '081234567804',
                    address: 'Jl. Thamrin No. 90, Jakarta',
                    isActive: true
                },
                {
                    username: 'budi.wijaya',
                    firstName: 'Budi',
                    lastName: 'Wijaya',
                    email: 'budi.wijaya@students.sekolah.ac.id',
                    password: 'student123',
                    role: 'student',
                    phoneNumber: '081234567805',
                    address: 'Jl. Gatot Subroto No. 12, Jakarta',
                    isActive: true
                }
            ]);
        }

        // Create students if not exists
        let students = await Student.find().limit(5);
        if (students.length === 0) {
            console.log('Creating sample students...');
            students = await Student.insertMany([
                {
                    studentId: 'STD20240001',
                    user: studentUsers[0]._id,
                    class: classes[0]._id,
                    studentNumber: 'STD202400001',
                    enrollmentDate: new Date('2024-07-15'),
                    parentName: 'Budi Santoso',
                    parentPhone: '081234567890',
                    birthDate: new Date('2007-05-15'),
                    birthPlace: 'Jakarta',
                    address: 'Jl. Merdeka No. 123, Jakarta',
                    status: 'active'
                },
                {
                    studentId: 'STD20240002',
                    user: studentUsers[1]._id,
                    class: classes[0]._id,
                    studentNumber: 'STD202400002',
                    enrollmentDate: new Date('2024-07-15'),
                    parentName: 'Ahmad Rahman',
                    parentPhone: '081234567891',
                    birthDate: new Date('2007-03-22'),
                    birthPlace: 'Jakarta',
                    address: 'Jl. Proklamasi No. 45, Jakarta',
                    status: 'active'
                },
                {
                    studentId: 'STD20240003',
                    user: studentUsers[2]._id,
                    class: classes[1]._id,
                    studentNumber: 'STD202400003',
                    enrollmentDate: new Date('2024-07-15'),
                    parentName: 'Sari Dewi',
                    parentPhone: '081234567892',
                    birthDate: new Date('2007-08-10'),
                    birthPlace: 'Jakarta',
                    address: 'Jl. Sudirman No. 78, Jakarta',
                    status: 'active'
                },
                {
                    studentId: 'STD20240004',
                    user: studentUsers[3]._id,
                    class: classes[1]._id,
                    studentNumber: 'STD202400004',
                    enrollmentDate: new Date('2024-07-15'),
                    parentName: 'Joko Widodo',
                    parentPhone: '081234567893',
                    birthDate: new Date('2007-12-05'),
                    birthPlace: 'Jakarta',
                    address: 'Jl. Thamrin No. 90, Jakarta',
                    status: 'active'
                },
                {
                    studentId: 'STD20240005',
                    user: studentUsers[4]._id,
                    class: classes[2]._id,
                    studentNumber: 'STD202400005',
                    enrollmentDate: new Date('2024-07-15'),
                    parentName: 'Mega Sari',
                    parentPhone: '081234567894',
                    birthDate: new Date('2007-01-18'),
                    birthPlace: 'Jakarta',
                    address: 'Jl. Gatot Subroto No. 12, Jakarta',
                    status: 'active'
                }
            ]);
        }

        // Seed Lesson Plans with realistic data
        console.log('Creating lesson plans...');
        let lessonPlans = [];
        let cbtTests = [];
        const today = new Date();
        
        // Ensure we have enough data
        if (subjects.length >= 2 && classes.length >= 2 && teachers.length >= 2) {
        // Generate lesson plans for the next 2 weeks
        for (let i = 0; i < 14; i++) {
            const lessonDate = new Date(today);
            lessonDate.setDate(today.getDate() + i);
            
            // Skip weekends
            if (lessonDate.getDay() === 0 || lessonDate.getDay() === 6) continue;
            
            // Create multiple lessons per day
            const dailyLessons = [
                {
                    title: `Aljabar Linear - Persamaan dan Fungsi`,
                    subject: subjects[0]._id,
                    class: classes[0]._id,
                    teacher: teachers[0]._id,
                    date: lessonDate,
                    startTime: '08:00',
                    endTime: '09:30',
                    objectives: [
                        'Siswa mampu memahami konsep persamaan linear',
                        'Siswa dapat menyelesaikan soal persamaan linear satu variabel',
                        'Siswa memahami aplikasi persamaan linear dalam kehidupan sehari-hari'
                    ],
                    materials: [
                        {
                            name: 'Modul Aljabar Linear.pdf',
                            type: 'document',
                            url: 'https://example.com/algebra-module.pdf',
                            description: 'Modul pembelajaran aljabar linear lengkap dengan contoh soal'
                        },
                        {
                            name: 'Video Penjelasan Persamaan Linear',
                            type: 'video',
                            url: 'https://youtube.com/watch?v=example',
                            description: 'Video penjelasan konsep persamaan linear'
                        }
                    ],
                    activities: [
                        {
                            name: 'Penjelasan Materi',
                            duration: 30,
                            description: 'Guru menjelaskan konsep dasar persamaan linear'
                        },
                        {
                            name: 'Latihan Soal Berkelompok',
                            duration: 40,
                            description: 'Siswa mengerjakan soal-soal dalam kelompok kecil'
                        },
                        {
                            name: 'Presentasi Hasil',
                            duration: 20,
                            description: 'Setiap kelompok mempresentasikan hasil diskusi'
                        }
                    ],
                    homework: {
                        title: 'Latihan Soal Persamaan Linear',
                        description: 'Kerjakan soal nomor 1-15 pada buku paket halaman 45-47',
                        dueDate: new Date(lessonDate.getTime() + 2 * 24 * 60 * 60 * 1000),
                        attachments: [
                            {
                                filename: 'soal-tambahan.pdf',
                                url: 'https://example.com/soal-tambahan.pdf'
                            }
                        ]
                    },
                    status: i < 3 ? 'completed' : i < 7 ? 'ongoing' : 'planned',
                    notes: 'Fokus pada pemahaman konsep dasar sebelum masuk ke aplikasi yang lebih kompleks'
                },
                {
                    title: `Ekosistem dan Keanekaragaman Hayati`,
                    subject: subjects[1]._id,
                    class: classes[0]._id,
                    teacher: teachers[1]._id,
                    date: lessonDate,
                    startTime: '10:00',
                    endTime: '11:30',
                    objectives: [
                        'Siswa memahami komponen-komponen ekosistem',
                        'Siswa dapat menganalisis hubungan antar komponen ekosistem',
                        'Siswa menyadari pentingnya menjaga keanekaragaman hayati'
                    ],
                    materials: [
                        {
                            name: 'Buku Biologi Kelas 10 Bab 8',
                            type: 'document',
                            url: 'https://example.com/bio-textbook.pdf',
                            description: 'Buku teks resmi mata pelajaran biologi'
                        }
                    ],
                    activities: [
                        {
                            name: 'Diskusi Komponen Ekosistem',
                            duration: 45,
                            description: 'Membahas komponen biotik dan abiotik dalam ekosistem'
                        },
                        {
                            name: 'Analisis Kasus Kerusakan Ekosistem',
                            duration: 45,
                            description: 'Menganalisis dampak kerusakan ekosistem terhadap keanekaragaman hayati'
                        }
                    ],
                    homework: {
                        title: 'Observasi Ekosistem Sekitar',
                        description: 'Lakukan observasi ekosistem di sekitar rumah dan buat laporan singkat',
                        dueDate: new Date(lessonDate.getTime() + 7 * 24 * 60 * 60 * 1000)
                    },
                    status: i < 2 ? 'completed' : i < 5 ? 'ongoing' : 'planned'
                }
            ];
            
            lessonPlans.push(...dailyLessons);
        }
        
        await LessonPlan.insertMany(lessonPlans);

        // Seed CBT with realistic data
        console.log('Creating CBT tests...');
        cbtTests = [
            {
                title: 'Ulangan Harian Matematika - Aljabar Linear',
                subject: subjects[0]._id,
                class: classes[0]._id,
                teacher: teachers[0]._id,
                date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
                startTime: '08:00',
                endTime: '09:30',
                duration: 90,
                questions: [
                    {
                        content: 'Selesaikan persamaan linear: 2x + 5 = 13',
                        type: 'multiple-choice',
                        options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
                        correctAnswer: 'x = 4',
                        score: 10
                    },
                    {
                        content: 'Jika 3x - 7 = 2x + 8, maka nilai x adalah...',
                        type: 'multiple-choice',
                        options: ['15', '10', '12', '18'],
                        correctAnswer: '15',
                        score: 10
                    },
                    {
                        content: 'Grafik fungsi linear y = 2x + 3 memotong sumbu y di titik...',
                        type: 'multiple-choice',
                        options: ['(0, 2)', '(0, 3)', '(3, 0)', '(2, 0)'],
                        correctAnswer: '(0, 3)',
                        score: 15
                    },
                    {
                        content: 'Jelaskan langkah-langkah menyelesaikan sistem persamaan linear dua variabel dengan metode eliminasi!',
                        type: 'essay',
                        options: [],
                        correctAnswer: 'Jawaban lengkap mencakup: 1) Menyamakan koefisien salah satu variabel, 2) Mengeliminasi variabel tersebut, 3) Mencari nilai satu variabel, 4) Substitusi untuk mencari variabel lainnya',
                        score: 25
                    },
                    {
                        content: 'Sebuah toko menjual pensil dan penggaris. Harga 3 pensil dan 2 penggaris adalah Rp 7.000. Harga 2 pensil dan 3 penggaris adalah Rp 8.000. Berapa harga 1 pensil dan 1 penggaris?',
                        type: 'essay',
                        options: [],
                        correctAnswer: 'Jawaban: Harga 1 pensil = Rp 1.000, harga 1 penggaris = Rp 2.000, jadi total = Rp 3.000',
                        score: 30
                    }
                ],
                totalScore: 100,
                status: 'scheduled'
            },
            {
                title: 'Quiz Biologi - Ekosistem',
                subject: subjects[1]._id,
                class: classes[0]._id,
                teacher: teachers[1]._id,
                date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
                startTime: '10:00',
                endTime: '11:00',
                duration: 60,
                questions: [
                    {
                        content: 'Komponen biotik dalam ekosistem meliputi...',
                        type: 'multiple-choice',
                        options: ['Produsen, konsumen, pengurai', 'Tanah, air, udara', 'Suhu, kelembaban, cahaya', 'Semua jawaban benar'],
                        correctAnswer: 'Produsen, konsumen, pengurai',
                        score: 20
                    },
                    {
                        content: 'Organisme yang dapat membuat makanan sendiri disebut...',
                        type: 'multiple-choice',
                        options: ['Konsumen primer', 'Produsen', 'Konsumen sekunder', 'Pengurai'],
                        correctAnswer: 'Produsen',
                        score: 20
                    },
                    {
                        content: 'Rantai makanan selalu dimulai dari...',
                        type: 'multiple-choice',
                        options: ['Konsumen', 'Produsen', 'Pengurai', 'Karnivora'],
                        correctAnswer: 'Produsen',
                        score: 20
                    },
                    {
                        content: 'Jelaskan perbedaan antara rantai makanan dan jaring-jaring makanan!',
                        type: 'essay',
                        options: [],
                        correctAnswer: 'Rantai makanan menunjukkan alur makan-dimakan linear, sedangkan jaring-jaring makanan menunjukkan hubungan yang lebih kompleks dengan banyak pilihan makanan',
                        score: 40
                    }
                ],
                totalScore: 100,
                status: 'scheduled'
            },
            {
                title: 'Simulasi Ujian Tengah Semester - Kimia',
                subject: subjects[2]._id,
                class: classes[1]._id,
                teacher: teachers[2]._id,
                date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
                startTime: '13:00',
                endTime: '15:00',
                duration: 120,
                questions: [
                    {
                        content: 'Rumus kimia untuk asam sulfat adalah...',
                        type: 'multiple-choice',
                        options: ['H2SO4', 'HCl', 'HNO3', 'H3PO4'],
                        correctAnswer: 'H2SO4',
                        score: 10
                    },
                    {
                        content: 'Dalam reaksi: 2H2 + O2 → 2H2O, zat yang bertindak sebagai oksidator adalah...',
                        type: 'multiple-choice',
                        options: ['H2', 'O2', 'H2O', 'Tidak ada'],
                        correctAnswer: 'O2',
                        score: 15
                    }
                ],
                totalScore: 100,
                status: 'scheduled'
            },
            {
                title: 'Latihan CBT Bahasa Indonesia',
                subject: subjects[4]._id,
                class: classes[2]._id,
                teacher: teachers[0]._id,
                date: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
                startTime: '07:30',
                endTime: '08:30',
                duration: 60,
                questions: [
                    {
                        content: 'Ide pokok dalam paragraf biasanya terdapat pada...',
                        type: 'multiple-choice',
                        options: ['Kalimat pertama', 'Kalimat terakhir', 'Kalimat utama', 'Semua jawaban benar'],
                        correctAnswer: 'Kalimat utama',
                        score: 25
                    }
                ],
                totalScore: 100,
                status: 'active'
            }
        ];
        
        await CBT.insertMany(cbtTests);
        }

        console.log('✅ Database seeding completed successfully!');
        console.log(`📚 Created ${lessonPlans.length} lesson plans`);
        console.log(`💻 Created ${cbtTests.length} CBT tests`);
        console.log(`📖 Using ${subjects.length} subjects`);
        console.log(`🏫 Using ${classes.length} classes`);
        console.log(`👨‍🏫 Using ${teachers.length} teachers`);
        console.log(`👨‍🎓 Using ${students ? students.length : 0} students`);
        console.log('');
        console.log('Login credentials:');
        console.log('📝 Admin: username=admin, password=admin123');
        console.log('👨‍🏫 Teacher: username=guru_math, password=password123');
        console.log('👨‍🎓 Student: username=ahmad.fauzi, password=student123');
        
        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seeding function
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;

