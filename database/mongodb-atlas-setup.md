# MongoDB Atlas Setup Guide

## 1. Langkah-langkah Setup

### A. Buat Akun MongoDB Atlas
1. Kunjungi: https://cloud.mongodb.com
2. Klik "Try Free" atau "Sign Up"  
3. Isi form registrasi dengan email dan password
4. Verifikasi email jika diminta

### B. Buat Cluster Database
1. Setelah login, klik "Build a Database"
2. Pilih "M0 Sandbox" (FREE tier - 512MB storage)
3. Pilih provider cloud (AWS recommended) dan region terdekat
4. Beri nama cluster: `sims-cluster`
5. Klik "Create"

### C. Setup Database User
1. Di sidebar kiri, klik "Database Access"
2. Klik "Add New Database User"
3. Pilih "Password" authentication method
4. Username: `sims-admin` (atau sesuai keinginan)
5. Password: Buat password yang kuat (simpan untuk nanti!)
6. Database User Privileges: "Read and write to any database"
7. Klik "Add User"

### D. Setup Network Access
1. Di sidebar kiri, klik "Network Access"  
2. Klik "Add IP Address"
3. Untuk development: pilih "Allow Access from Anywhere" (0.0.0.0/0)
4. Untuk production: tambahkan IP address server yang spesifik
5. Klik "Confirm"

### E. Dapatkan Connection String
1. Kembali ke "Database" di sidebar
2. Klik "Connect" pada cluster Anda
3. Pilih "Drivers"
4. Pilih "Node.js" dan versi driver terbaru
5. Copy connection string yang akan terlihat seperti:
   ```
   mongodb+srv://<username>:<password>@sims-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## 2. Update Configuration

### Update file `.env`
Ganti bagian MONGODB_URI di file `.env` dengan connection string Anda:

```env
MONGODB_URI=mongodb+srv://sims-admin:your-password@sims-cluster.xxxxx.mongodb.net/sims?retryWrites=true&w=majority
```

**Penting:** 
- Ganti `<username>` dengan username yang dibuat (contoh: sims-admin)
- Ganti `<password>` dengan password yang dibuat
- Ganti `<cluster-name>` dengan nama cluster Anda
- Tambahkan nama database `sims` di akhir URL sebelum query parameters

### Contoh Connection String Lengkap:
```
mongodb+srv://sims-admin:MyPassword123@sims-cluster.abc123.mongodb.net/sims?retryWrites=true&w=majority
```

## 3. Test Koneksi

Setelah setup selesai, test koneksi dengan:

```bash
npm run dev
```

Jika berhasil, Anda akan melihat pesan:
```
Connected to MongoDB
Server running on port 5000
```

## 4. Security Best Practices

### Untuk Production:
1. **IP Whitelist**: Jangan gunakan 0.0.0.0/0, gunakan IP spesifik
2. **Strong Password**: Gunakan password yang kompleks
3. **Environment Variables**: Jangan commit file .env ke repository
4. **Database Name**: Gunakan nama database yang spesifik

### Backup Strategy:
1. MongoDB Atlas menyediakan automated backup
2. Setup backup schedule di Atlas dashboard
3. Untuk data penting, pertimbangkan point-in-time recovery

## 5. Monitoring

1. **Atlas Dashboard**: Monitor performa database
2. **Alerts**: Setup alerts untuk usage dan performance
3. **Logs**: Review connection logs secara berkala

## 6. Troubleshooting

### Connection Timeout:
- Periksa Network Access whitelist
- Pastikan IP address sudah benar
- Cek firewall lokal

### Authentication Failed:
- Periksa username dan password
- Pastikan user memiliki permission yang tepat
- Cek special characters dalam password (encode jika perlu)

### Database Not Found:
- Pastikan nama database ada di connection string
- Database akan dibuat otomatis saat pertama kali insert data

## 7. Cost Optimization

### Free Tier Limits:
- 512MB storage
- Shared RAM dan CPU
- No backup untuk M0

### Upgrade Path:
- M2/M5 untuk production dengan backup
- Dedicated clusters untuk high performance
- Multi-region untuk high availability
