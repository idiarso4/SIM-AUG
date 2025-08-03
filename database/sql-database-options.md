# SQL Database Options untuk SIMS

## 1. MongoDB Atlas SQL Interface

MongoDB Atlas sekarang mendukung SQL queries melalui Atlas SQL Interface:

### Keunggulan:
- Query dengan syntax SQL familiar
- Tetap menggunakan MongoDB sebagai storage
- Real-time analytics dengan SQL
- Integrasi dengan BI tools

### Setup:
1. Di MongoDB Atlas Dashboard, pilih cluster Anda
2. Klik "Data Federation" → "SQL"
3. Enable Atlas SQL untuk cluster
4. Gunakan connection string khusus untuk SQL interface

### Contoh Query:
```sql
-- Ambil semua siswa aktif
SELECT * FROM students WHERE status = 'active';

-- Join data siswa dengan kelas
SELECT s.firstName, s.lastName, c.className 
FROM students s 
LEFT JOIN classes c ON s.currentClass = c._id;

-- Agregasi jumlah siswa per kelas
SELECT c.className, COUNT(s._id) as studentCount
FROM classes c 
LEFT JOIN students s ON c._id = s.currentClass
GROUP BY c.className;
```

## 2. PostgreSQL Cloud Options

### A. Supabase (Recommended - Free Tier Available)
- Website: https://supabase.com
- Free tier: 500MB database, 50MB file storage
- Real-time subscriptions
- Built-in authentication
- Auto-generated REST API

### B. ElephantSQL
- Website: https://www.elephantsql.com
- Free tier: 20MB database
- Dedicated PostgreSQL instances

### C. Railway
- Website: https://railway.app
- Free tier dengan usage limits
- Easy deployment

### D. Neon
- Website: https://neon.tech
- Serverless PostgreSQL
- Free tier available

## 3. MySQL Cloud Options

### A. PlanetScale
- Website: https://planetscale.com
- Serverless MySQL platform
- Free tier: 1 database, 1GB storage
- Branching like Git

### B. AWS RDS MySQL
- Managed MySQL service
- Free tier: 750 hours/month
- 20GB storage

### C. Google Cloud SQL
- Managed MySQL/PostgreSQL
- Free tier credits

## 4. Database Schema untuk SQL

Jika menggunakan SQL database, berikut schema yang dikonversi:

### Users Table:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('super_admin', 'admin', 'teacher', 'student', 'parent')),
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
```

### Students Table:
```sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    nisn VARCHAR(50) UNIQUE,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    blood_type VARCHAR(5),
    religion VARCHAR(50) NOT NULL,
    nationality VARCHAR(50) DEFAULT 'Indonesia',
    current_class_id INTEGER REFERENCES classes(id),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    graduation_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Classes Table:
```sql
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
```

## 5. Rekomendasi

### Untuk Development/Learning:
1. **MongoDB Atlas** (tetap NoSQL) - paling mudah setup
2. **Supabase** (PostgreSQL) - jika ingin SQL dengan features lengkap
3. **PlanetScale** (MySQL) - jika familiar dengan MySQL

### Untuk Production:
1. **MongoDB Atlas** dengan SQL interface untuk analytics
2. **Supabase Pro** untuk PostgreSQL
3. **AWS RDS** untuk enterprise-grade SQL

## 6. Migration Path

Jika ingin ganti ke SQL database:

1. **Install SQL adapter** (misalnya: `pg` untuk PostgreSQL, `mysql2` untuk MySQL)
2. **Update models** dari Mongoose ke SQL ORM (Sequelize/Prisma)
3. **Convert schema** dari MongoDB ke SQL tables
4. **Update queries** dari MongoDB aggregation ke SQL joins

Mana yang Anda pilih untuk project SIMS ini?
