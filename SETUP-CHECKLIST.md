# ✅ SETUP CHECKLIST - MongoDB Atlas

## 📋 Ikuti langkah ini satu per satu:

### ☐ STEP 1: Buat Database Cluster
```
1. Di dashboard Atlas, klik "Database" (sidebar kiri)
2. Klik "Build a Database" atau tombol hijau "Create"
3. Pilih "M0 Sandbox" (FREE - $0.00/month)
4. Provider: AWS
5. Region: Pilih yang terdekat (misal: Singapore)
6. Cluster Name: Cluster0 (biarkan default)
7. Klik "Create"
8. TUNGGU 1-3 menit sampai status "Active"
```

### ☐ STEP 2: Buat Database User
```
1. Klik "Database Access" (sidebar kiri)
2. Klik "Add New Database User"
3. Authentication Method: Password
4. Username: sims-admin
5. Password: SIMSPassword123
   ⚠️  CATAT PASSWORD INI! ⚠️
6. Database User Privileges: "Read and write to any database"
7. Klik "Add User"
```

### ☐ STEP 3: Setting Network Access
```
1. Klik "Network Access" (sidebar kiri)
2. Klik "Add IP Address"
3. Klik "ALLOW ACCESS FROM ANYWHERE"
4. IP Address akan otomatis: 0.0.0.0/0
5. Comment: Development Access
6. Klik "Confirm"
```

### ☐ STEP 4: Dapatkan Connection String
```
1. Kembali ke "Database" (sidebar kiri)
2. Klik "Connect" pada cluster Anda
3. Pilih "Drivers"
4. Driver: Node.js, Version: 4.1 or later
5. COPY connection string yang muncul
6. Akan seperti ini:
   mongodb+srv://sims-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## 🔧 UPDATE KONFIGURASI

### Edit file .env di folder backend:
```env
PORT=5000
MONGODB_URI=mongodb+srv://sims-admin:SIMSPassword123@cluster0.xxxxx.mongodb.net/sims?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here_change_in_production_make_it_complex
JWT_EXPIRE=7d
NODE_ENV=development
```

**PENTING:** 
- Ganti `<password>` dengan password Anda: `SIMSPassword123`
- Ganti `cluster0.xxxxx` dengan cluster name Anda yang sebenarnya
- Tambahkan `/sims` setelah `.net` untuk nama database

## 🧪 TEST KONEKSI

Jalankan perintah ini di terminal (dari folder backend):

```bash
npm run test-db
```

Jika berhasil, akan muncul:
```
✅ Successfully connected to MongoDB Atlas!
Database: sims
Host: cluster0.xxxxx.mongodb.net
```

## 🚀 JALANKAN SERVER

```bash
npm run dev
```

Jika berhasil, akan muncul:
```
Connected to MongoDB
Server running on port 5000
```

## 🆘 TROUBLESHOOTING

### Jika koneksi gagal:
1. **Cek password**: Pastikan password di connection string sama dengan yang dibuat
2. **Cek network access**: Pastikan IP 0.0.0.0/0 sudah ditambahkan
3. **Cek cluster status**: Pastikan cluster status "Active" di dashboard
4. **Cek connection string**: Pastikan sudah mengganti <password> dengan password asli

### Error "Authentication failed":
- Periksa username dan password
- Pastikan user sudah dibuat dan aktif

### Error "Network timeout":
- Periksa Network Access settings
- Pastikan firewall tidak memblokir koneksi

## 📞 BANTUAN

Jika masih bingung, screenshot bagian yang bermasalah dan tanyakan!

### Status Progress:
- [x] Cluster dibuat ✅
- [x] Database user dibuat (sims-admin) ✅
- [x] Network access diatur ✅
- [x] Connection string didapat ✅
- [x] File .env diupdate ✅
- [x] Test koneksi berhasil ✅
- [x] Server berjalan di port 3002 ✅
- [x] Express downgrade ke 4.18.2 ✅
- [x] Semua routes dimuat ✅

## 🎯 CURRENT STATUS: READY FOR DEVELOPMENT!

### Akses API:
- Health Check: http://localhost:3002
- API Test: http://localhost:3002/api/test
- Authentication: http://localhost:3002/api/auth/

**Sekarang, ikuti STEP 1 terlebih dahulu!**
