require('dotenv').config();

console.log('🔍 MENCARI CONNECTION STRING YANG TEPAT...\n');

// Format umum connection string MongoDB Atlas
const baseFormats = [
    'mongodb+srv://sims-admin:iOia3oZFypyai2U5@cluster0.mongodb.net/sims?retryWrites=true&w=majority',
    'mongodb+srv://sims-admin:iOia3oZFypyai2U5@cluster0.cluster-abc123.mongodb.net/sims?retryWrites=true&w=majority',
    'mongodb+srv://sims-admin:iOia3oZFypyai2U5@cluster0.xxxxx.mongodb.net/sims?retryWrites=true&w=majority'
];

console.log('📋 KEMUNGKINAN FORMAT CONNECTION STRING:\n');
baseFormats.forEach((format, index) => {
    console.log(`${index + 1}. ${format}\n`);
});

console.log('💡 UNTUK MENDAPATKAN CONNECTION STRING YANG TEPAT:');
console.log('1. Buka MongoDB Atlas Dashboard');
console.log('2. Klik "Database" di sidebar');
console.log('3. Cari cluster Anda (biasanya bernama "Cluster0")');
console.log('4. Pastikan status cluster "Active" (hijau)');
console.log('5. Klik tombol "Connect" pada cluster');
console.log('6. Pilih "Drivers"');
console.log('7. Pilih "Node.js"');
console.log('8. Copy connection string yang muncul');
console.log('9. Ganti <password> dengan: iOia3oZFypyai2U5');
console.log('10. Tambahkan /sims sebelum ?retryWrites\n');

console.log('📸 JIKA MASIH BINGUNG:');
console.log('- Screenshot halaman Database Atlas Anda');
console.log('- Atau beritahu apa yang Anda lihat di dashboard\n');

// Cek current connection string
console.log('🔧 CONNECTION STRING SAAT INI DI .ENV:');
console.log(process.env.MONGODB_URI || 'Tidak ada MONGODB_URI di .env');
