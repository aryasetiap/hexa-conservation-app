# Hexa Conservation - Aplikasi Peta Negara Dunia

Aplikasi SvelteKit yang menampilkan poligon negara dunia pada peta interaktif dengan autentikasi Supabase dan fitur ekspor PDF.

## 🌟 Fitur

- **Peta Dunia Interaktif**: Menampilkan semua negara dengan poligon yang dapat diklik
- **Seleksi Negara**: Pilih negara dari peta atau daftar di sidebar
- **Ekspor PDF**: Buat laporan PDF berisi negara terpilih dan data sesi pengguna
- **Autentikasi Supabase**: Sistem login email/password yang aman
- **Desain Responsif**: Antarmuka ramah mobile dengan TailwindCSS

## 🛠 Teknologi

- **Frontend**: SvelteKit 2 dengan Svelte 5 (runes syntax)
- **Styling**: TailwindCSS
- **Autentikasi & Database**: Supabase
- **Pemetaan**: Leaflet
- **Pembuatan PDF**: jsPDF
- **Runtime**: Bun
- **Sumber Data**: [DataHub GeoJSON Countries](https://datahub.io/core/geo-countries/r/countries.geojson)

## 📋 Prasyarat

- Bun runtime terpasang
- Akun Supabase (tier gratis)
- Git

## 🚀 Instruksi Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/aryasetiap/hexa-conservation-app.git
cd hexa-conservation-app
```

### 2. Instalasi Dependensi

```bash
bun install
```

### 3. Setup Supabase

1. Buat proyek baru di [supabase.com](https://supabase.com)
2. Masuk ke Project Settings → API
3. Salin URL proyek dan anon key Anda
4. Di pengaturan Authentication, aktifkan provider email/password
5. Buat user uji coba di Authentication → Users (form sign-up belum tersedia)

### 4. Konfigurasi Environment

Buat file `.env.local` di root proyek:

```env
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Jalankan Server Development

```bash
bun run dev
```

Aplikasi dapat diakses di `http://localhost:5173`

## 📚 Library yang Digunakan

- **@supabase/supabase-js**: Client Supabase
- **leaflet**: Library peta interaktif
- **jspdf**: Pembuatan PDF
- **tailwindcss**: Framework CSS utility-first

## 🎯 Persyaratan Fungsional Terpenuhi

- ✅ **Autentikasi**: Login email/password via Supabase
- ✅ **Peta Dunia**: Poligon negara interaktif dari API GeoJSON
- ✅ **Seleksi Negara**: Klik negara di peta atau pilih dari sidebar
- ✅ **Ekspor PDF**: Buat laporan dengan data user dan negara terpilih
- ✅ **Manajemen Sesi**: Logout dan pengelolaan sesi yang aman

## 🚀 Build Produksi

```bash
bun run build
bun run preview
```

## 🔧 Perintah Pengembangan

```bash
# Jalankan server development
bun run dev

# Build untuk produksi
bun run build

# Preview build produksi
bun run preview

# Jalankan linting
bun run lint

# Format kode
bun run format
```

## 📝 Variabel Environment yang Dibutuhkan

```env
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎮 Cara Penggunaan

1. **Login**: Gunakan kredensial Supabase yang sudah dibuat
2. **Eksplorasi Peta**: Klik negara untuk memilih
3. **Gunakan Sidebar**: Telusuri dan pilih negara dari daftar
4. **Ekspor PDF**: Klik "Download as PDF" untuk membuat laporan
5. **Logout**: Klik tombol logout untuk keluar
