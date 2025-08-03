# Requirements - Sistem Informasi Manajemen Sekolah

## 1. Gambaran Umum Sistem
Sistem Informasi Manajemen Sekolah (SIMS) adalah aplikasi web yang dirancang untuk mengelola operasional sekolah secara digital, mulai dari manajemen siswa, guru, kelas, hingga akademik.

## 2. Functional Requirements

### 2.1 Manajemen Pengguna
- **Login & Authentication**
  - Login dengan username dan password
  - Role-based access control (Admin, Guru, Siswa, Orang Tua)
  - Session management dan logout

### 2.2 Manajemen Siswa
- **Pendaftaran Siswa**
  - Form pendaftaran siswa baru
  - Upload foto dan dokumen
  - Generate nomor induk siswa otomatis
- **Data Siswa**
  - CRUD data siswa (Create, Read, Update, Delete)
  - Data pribadi, alamat, kontak orang tua
  - Riwayat pendidikan
  - Status aktif/tidak aktif

### 2.3 Manajemen Guru & Staff
- **Data Guru**
  - CRUD data guru dan staff
  - Data pribadi, kualifikasi, mata pelajaran
  - Jadwal mengajar
- **Penugasan**
  - Assign guru ke mata pelajaran
  - Assign wali kelas

### 2.4 Manajemen Akademik
- **Mata Pelajaran**
  - CRUD mata pelajaran
  - Kategori dan tingkat kelas
- **Kelas & Rombel**
  - Pembentukan kelas
  - Penempatan siswa ke kelas
  - Wali kelas
- **Jadwal Pelajaran**
  - Pembuatan jadwal pelajaran
  - Assign guru ke jadwal
  - Manajemen ruang kelas

### 2.5 Sistem Penilaian
- **Input Nilai**
  - Input nilai harian, UTS, UAS
  - Multiple assessment types
- **Rapor**
  - Generate rapor siswa
  - Export ke PDF
- **Ranking**
  - Perhitungan ranking kelas
  - Statistik nilai

### 2.6 Absensi
- **Absensi Siswa**
  - Input kehadiran harian
  - Kategorisasi (Hadir, Sakit, Izin, Alpha)
  - Laporan absensi
- **Absensi Guru**
  - Kehadiran guru mengajar
  - Laporan kehadiran bulanan

### 2.7 Komunikasi
- **Pengumuman**
  - Posting pengumuman sekolah
  - Target audience (siswa, guru, orang tua)
- **Pesan**
  - Sistem pesan internal
  - Notifikasi

### 2.8 Laporan
- **Dashboard**
  - Statistik sekolah
  - Grafik dan chart
- **Laporan Akademik**
  - Laporan nilai per kelas
  - Laporan kelulusan
- **Laporan Keuangan**
  - SPP dan pembayaran
  - Laporan tunggakan

## 3. Non-Functional Requirements

### 3.1 Performance
- Response time < 3 detik untuk operasi normal
- Support minimal 100 concurrent users
- Database optimization untuk query besar

### 3.2 Security
- Password encryption
- SQL injection prevention
- XSS protection
- Role-based authorization

### 3.3 Usability
- Responsive design (mobile-friendly)
- Intuitive user interface
- Multi-language support (Indonesia/English)

### 3.4 Reliability
- 99% uptime
- Data backup otomatis
- Error handling dan logging

### 3.5 Scalability
- Modular architecture
- Database scalability
- Cloud deployment ready

## 4. System Constraints

### 4.1 Technical Constraints
- Web-based application
- Modern browsers support
- Database: MySQL/PostgreSQL
- Server: PHP/Node.js/Python

### 4.2 Business Constraints
- Budget terbatas untuk development
- Timeline 3-6 bulan untuk MVP
- Training minimal untuk user

## 5. User Roles & Permissions

### 5.1 Super Admin
- Full system access
- User management
- System configuration

### 5.2 Admin Sekolah
- Manajemen siswa dan guru
- Laporan dan statistik
- Pengumuman

### 5.3 Guru
- Input nilai dan absensi
- Lihat data siswa di kelasnya
- Komunikasi dengan siswa/orang tua

### 5.4 Siswa
- Lihat nilai dan absensi
- Lihat jadwal pelajaran
- Lihat pengumuman

### 5.5 Orang Tua
- Lihat data akademik anak
- Komunikasi dengan guru
- Lihat tagihan SPP

## 6. Integration Requirements
- API untuk mobile app (future)
- Export data ke Excel/PDF
- Email notifications
- SMS gateway (optional)

## 7. Data Requirements
- Data siswa minimal 1000 records
- Data guru minimal 50 records
- Historical data 5 tahun
- Backup retention 1 tahun
