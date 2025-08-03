# School Management Android App

Aplikasi Android untuk manajemen sekolah yang terhubung dengan backend API.

## Cara Menjalankan Aplikasi

### Prasyarat
1. Install Android Studio
2. Install JDK 8 atau higher
3. Backend API harus berjalan di `http://localhost:5000`

### Langkah-langkah:

1. **Buka Android Studio**
   - File → Open → Pilih folder `android-app`

2. **Sync Project**
   - Tunggu hingga Gradle sync selesai

3. **Setup Emulator**
   - Tools → AVD Manager → Create Virtual Device
   - Pilih device (misalnya Pixel 4)
   - Pilih API Level 30 atau higher
   - Finish

4. **Jalankan Backend**
   ```bash
   cd ../backend
   npm start
   ```

5. **Update Base URL**
   - Buka file `NetworkClient.kt`
   - Ubah `BASE_URL` jika perlu:
     - Emulator: `http://10.0.2.2:5000/api/`
     - Device real: `http://YOUR_IP:5000/api/`

6. **Run App**
   - Klik tombol Run (▶) di Android Studio
   - Pilih emulator yang sudah dibuat

## Testing di Browser (Alternatif)

Jika ingin testing lewat browser, buat web version sederhana:

### HTML Test Page
Buat file `test.html` untuk testing API:

```html
<!DOCTYPE html>
<html>
<head>
    <title>School App API Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 600px; }
        input, button { padding: 10px; margin: 5px; }
        .result { background: #f5f5f5; padding: 10px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>School Management API Test</h1>
        
        <h3>Login Test</h3>
        <input type="text" id="username" placeholder="Username">
        <input type="password" id="password" placeholder="Password">
        <button onclick="testLogin()">Test Login</button>
        
        <h3>Get Students</h3>
        <button onclick="getStudents()">Get All Students</button>
        
        <div id="result" class="result"></div>
    </div>

    <script>
        const API_BASE = 'http://localhost:5000/api';
        let authToken = '';

        async function testLogin() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                document.getElementById('result').innerHTML = JSON.stringify(data, null, 2);
                
                if (data.token) {
                    authToken = data.token;
                }
            } catch (error) {
                document.getElementById('result').innerHTML = 'Error: ' + error.message;
            }
        }

        async function getStudents() {
            try {
                const response = await fetch(`${API_BASE}/students`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                
                const data = await response.json();
                document.getElementById('result').innerHTML = JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('result').innerHTML = 'Error: ' + error.message;
            }
        }
    </script>
</body>
</html>
```

## Struktur Project

```
android-app/
├── app/
│   ├── src/main/
│   │   ├── java/com/sim/schoolapp/
│   │   │   ├── models/          # Data models
│   │   │   ├── network/         # API service
│   │   │   ├── repository/      # Data repository
│   │   │   ├── viewmodel/       # ViewModels
│   │   │   ├── ui/             # UI components
│   │   │   └── utils/          # Utilities
│   │   ├── res/                # Resources (layouts, strings, etc.)
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── build.gradle
├── settings.gradle
└── README.md
```

## API Endpoints

- **POST** `/auth/login` - Login user
- **POST** `/auth/register` - Register user  
- **GET** `/auth/me` - Get current user
- **GET** `/students` - Get all students
- **GET** `/teachers` - Get all teachers
- **POST** `/students` - Create student
- **PUT** `/students/:id` - Update student
- **DELETE** `/students/:id` - Delete student

## Features

- [x] User Authentication (Login/Logout)
- [x] Student Management (CRUD)
- [x] Teacher Management (CRUD)
- [x] Profile Management
- [x] Role-based Access Control
- [ ] Dashboard dengan statistik
- [ ] Attendance Management
- [ ] Grade Management

## Troubleshooting

1. **Network Error**: Pastikan backend berjalan dan URL benar
2. **Build Error**: Sync project dan clear cache
3. **Emulator Slow**: Allocate more RAM di AVD Manager
