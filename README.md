


# C242-PS405 - BackEnd API
Backend API untuk proyek capstone C242-PS405 adalah solusi komprehensif yang dikembangkan menggunakan Node.js, Express, Prisma ORM, dan terintegrasi dengan Google Cloud Platform untuk manajemen autentikasi, penyimpanan, dan komputasi. API ini menyediakan layanan utama seperti otentikasi pengguna (registrasi, login, manajemen token), manajemen profil, penyimpanan data MySQL, integrasi layanan cloud, validasi data melalui middleware khusus, dan endpoint API yang aman. Menggunakan teknologi JavaScript (Node.js), Express.js, Prisma, JWT, Cloud SQL (MySQL), Cloud Storage, dan dideploy di Google Cloud Platform (Cloud Run atau App Engine).

## Getting Started 🚀
- **Kloning Repositori**:
`git clone https://github.com/C242-PS405/cloud-computing.git`

- **Instal Dependensi**:
`npm install`

- **Konfigurasi Environment**:
Salin file `.env.example` menjadi `.env`
Isi variabel lingkungan sesuai kebutuhan

- **Migrasi Database**:
`npx prisma migrate dev`

- **Jalankan Aplikasi**:
`npm run start`

## Environment Variables 🔐
### `DATABASE_URL`
- **Deskripsi**: URL koneksi basis data untuk mengkoneksikan aplikasi dengan database
- **Contoh**: `mysql://username:password@localhost:5432/mydatabase`

### `TOKEN_SECRET`
- **Deskripsi**: Kunci rahasia untuk penandatanganan dan verifikasi token JWT (JSON Web Token)
- **Contoh**: `your_very_long_and_secure_random_secret_key`

### `CLOUD_STORAGE_BUCKET_NAME`
- **Deskripsi**: Nama bucket penyimpanan cloud untuk menyimpan file atau assets
- **Contoh**: `my-project-bucket`

### `GCP_PROJECT_ID`
- **Deskripsi**: ID proyek Google Cloud Platform untuk identifikasi project
- **Contoh**: `my-gcp-project-123456`

### `GCP_KEYFILE_PATH`
- **Deskripsi**: Path menuju file kunci JSON untuk otentikasi Google Cloud
- **Contoh**: `./config/gcp-service-account-key.json`

### `PREDICT_API_URL`
- **Deskripsi**: URL endpoint API untuk layanan prediksi atau machine learning
- **Contoh**: `https://predict-api.example.com/v1/predict`

## Project Directory Structure 📂
```bash
USERAPI/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── application/
│   │   ├── database.js
│   │   ├── logging.js
│   │   └── app.js
│   ├── service/
│   │   ├── cloud-storage.js
│   │   ├── history-service.js
│   │   ├── scraper-service.js
│   │   └── user.service.js
│   ├── controller/
│   │   ├── history-controller.js
│   │   ├── profile-controller.js
│   │   ├── scraper-controller.js
│   │   └── user.controller.js
│   ├── validation/
│   │   ├── validation.js
│   │   └── user-validation.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── upload-middleware.js
│   │   └── user.service.js
│   ├── error/
│   │   └── respon-eror.js
│   ├── route/
│   │   ├── public-api.js
│   │   └── user-api.js
│   └── main.js
│
├── .env.example
├── app.yaml
├── babel.config.json
├── package.json
├── package-lock.json
├── openapi.yaml
```
