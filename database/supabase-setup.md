# Supabase PostgreSQL Setup Guide

## 1. Setup Supabase

### A. Buat Akun Supabase
1. Kunjungi: https://supabase.com
2. Klik "Start your project" atau "Sign up"
3. Sign up dengan GitHub atau email
4. Verifikasi email jika diperlukan

### B. Buat Project Baru
1. Klik "New Project"
2. Pilih organization (buat baru jika belum ada)
3. Isi detail project:
   - **Name**: `sims-database`
   - **Database Password**: Buat password yang kuat (simpan!)
   - **Region**: Pilih yang terdekat
   - **Pricing Plan**: Free (untuk development)
4. Klik "Create new project"
5. Tunggu ~2 menit hingga database ready

### C. Dapatkan Connection Details
1. Di dashboard project, klik "Settings" → "Database"
2. Scroll ke "Connection parameters"
3. Copy informasi:
   - **Host**: db.xxx.supabase.co
   - **Database**: postgres
   - **Port**: 5432
   - **User**: postgres
   - **Password**: [password yang dibuat]

## 2. Install PostgreSQL Dependencies

```bash
npm install pg sequelize
npm install --save-dev @types/pg sequelize-cli
```

## 3. Update Environment Variables

Edit file `.env`:

```env
# Database Configuration
DB_TYPE=postgresql
DB_HOST=db.xxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USERNAME=postgres
DB_PASSWORD=your_supabase_password

# Connection String
DATABASE_URL=postgresql://postgres:your_password@db.xxx.supabase.co:5432/postgres

# JWT (dari Supabase Settings → API)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
```

## 4. Database Schema

### A. Menggunakan Supabase Dashboard
1. Di dashboard, klik "Table Editor"
2. Klik "Create a new table"
3. Buat tables sesuai schema

### B. Menggunakan SQL Editor
1. Di dashboard, klik "SQL Editor"
2. Copy-paste SQL schema dan execute

### C. Schema SQL untuk SIMS:

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('super_admin', 'admin', 'teacher', 'student', 'parent')) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    profile_picture VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    nisn VARCHAR(50) UNIQUE,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')) NOT NULL,
    blood_type VARCHAR(5),
    religion VARCHAR(50) NOT NULL,
    nationality VARCHAR(50) DEFAULT 'Indonesia',
    current_class_id INTEGER,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    graduation_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teachers table
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    teacher_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    employee_number VARCHAR(50) UNIQUE,
    date_of_hire DATE NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    class_name VARCHAR(100) UNIQUE NOT NULL,
    grade VARCHAR(5) NOT NULL,
    section VARCHAR(10) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    homeroom_teacher_id INTEGER REFERENCES teachers(id),
    max_capacity INTEGER DEFAULT 30,
    room VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects table
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL CHECK (credits BETWEEN 1 AND 6),
    category VARCHAR(20) CHECK (category IN ('core', 'elective', 'mandatory', 'optional')) NOT NULL,
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Class students (many-to-many)
CREATE TABLE class_students (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) NOT NULL,
    student_id INTEGER REFERENCES students(id) NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, student_id)
);

-- Teacher subjects (many-to-many)
CREATE TABLE teacher_subjects (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers(id) NOT NULL,
    subject_id INTEGER REFERENCES subjects(id) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(teacher_id, subject_id)
);

-- Add foreign key constraint for students.current_class_id
ALTER TABLE students 
ADD CONSTRAINT fk_student_current_class 
FOREIGN KEY (current_class_id) REFERENCES classes(id);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_teachers_teacher_id ON teachers(teacher_id);
CREATE INDEX idx_classes_academic_year ON classes(academic_year);
CREATE INDEX idx_subjects_code ON subjects(subject_code);
```

## 5. Test Connection

Buat file test untuk PostgreSQL:

```javascript
// utils/testPostgreSQL.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Connected to PostgreSQL (Supabase)');
        
        const result = await client.query('SELECT version()');
        console.log('Database version:', result.rows[0].version);
        
        client.release();
        console.log('✅ Connection test completed');
    } catch (error) {
        console.error('❌ PostgreSQL connection failed:', error.message);
    } finally {
        await pool.end();
    }
};

testConnection();
```

## 6. Keunggulan Supabase

### Features Built-in:
- **Authentication**: Built-in auth system
- **Real-time**: Real-time subscriptions
- **Storage**: File storage untuk uploads
- **Edge Functions**: Serverless functions
- **Auto APIs**: Auto-generated REST & GraphQL APIs

### Dashboard Features:
- **Table Editor**: Visual table management
- **SQL Editor**: Run custom queries
- **Auth Management**: Manage users
- **API Docs**: Auto-generated documentation

## 7. Migration dari MongoDB

Jika ingin migrate dari MongoDB ke PostgreSQL:

1. **Export data** dari MongoDB
2. **Transform data** sesuai SQL schema  
3. **Import data** ke PostgreSQL
4. **Update models** menggunakan Sequelize/Prisma
5. **Update queries** dari NoSQL ke SQL

## 8. Next Steps

1. Setup Supabase project
2. Run SQL schema di SQL Editor
3. Update environment variables
4. Install PostgreSQL dependencies
5. Test connection
6. Update models untuk SQL

Apakah Anda ingin lanjut dengan Supabase PostgreSQL atau tetap dengan MongoDB Atlas?
