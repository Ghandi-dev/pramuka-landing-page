# Pramuka SMAN 1 Pasawahan - Website & Admin CMS Dashboard

Website Landing Page dan Admin CMS (Content Management System) Dashboard untuk organisasi Pramuka SMA Negeri 1 Pasawahan. Proyek ini dibangun untuk menampilkan profil, kegiatan, galeri, dan pengumuman, sekaligus menyediakan antarmuka admin yang lengkap untuk mengelola konten tersebut.

## 🚀 Teknologi yang Digunakan (Tech Stack) & Kegunaannya

Berikut adalah daftar teknologi utama yang digunakan dalam pengembangan proyek ini beserta fungsinya:

### 1. Framework Utama
- **[Nuxt 4](https://nuxt.com/) & Vue 3**: Framework utama yang digunakan untuk membangun aplikasi secara keseluruhan. Menyediakan fungsionalitas seperti *routing* otomatis, *Server-Side Rendering* (SSR) untuk performa dan SEO yang lebih baik, serta struktur proyek yang terorganisir.

### 2. Styling & UI Components
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Framework utility-first CSS yang digunakan untuk mendesain gaya antarmuka (styling) secara responsif dan cepat pada seluruh halaman website.
- **[Shadcn UI](https://www.shadcn-vue.com/) (`shadcn-nuxt`, `reka-ui`)**: Kumpulan komponen antarmuka pengguna (UI) siap pakai yang *accessible* dan sangat dapat dikustomisasi. Digunakan secara ekstensif untuk membangun komponen di dashboard Admin CMS agar terlihat modern, konsisten, dan interaktif.
- **[Lucide Vue Next](https://lucide.dev/)**: Kumpulan ikon berbasis SVG yang elegan dan konsisten, digunakan sebagai pelengkap visual antarmuka website dan admin.

### 3. Backend & Database
- **[Supabase](https://supabase.com/) (`@supabase/supabase-js`)**: Platform Backend-as-a-Service (BaaS) open-source yang bertindak sebagai tulang punggung (backend) proyek ini. Kegunaan utamanya meliputi:
  - **Database (PostgreSQL)**: Menyimpan dan mengambil data dinamis seperti profil anggota, aktivitas, pengumuman, dan galeri.
  - **Autentikasi (Auth)**: Mengamankan akses login ke halaman dashboard Admin.
  - **Storage**: Media penyimpanan untuk aset gambar atau dokumen yang diunggah.

### 4. Manajemen Data & Tabel
- **[TanStack Table](https://tanstack.com/table/latest) (`@tanstack/vue-table`)**: *Headless UI library* untuk membuat tabel data tingkat lanjut (Data Grid). Diimplementasikan secara khusus pada halaman Admin CMS untuk memudahkan pengurus mengelola (menampilkan, *sorting*, *filtering*, dan *pagination*) kumpulan data besar seperti data anggota dan kegiatan.

### 5. Utilitas & Plugin Tambahan
- **`@nuxtjs/i18n`**: Modul lokalisasi (*Internationalization*) yang mendukung fitur multi-bahasa, memungkinkan website ini disajikan dalam Bahasa Indonesia maupun Bahasa Inggris.
- **`@vueuse/core`**: Koleksi kumpulan fungsi utilitas *Composition API* standar untuk Vue. Menyediakan logika pembantu yang praktis untuk interaksi dengan API peramban (browser) dan manajemen *state*.
- **`vue-sonner`**: Library komponen untuk menampilkan notifikasi *toast*. Berguna untuk memberikan umpan balik (feedback) visual instan kepada admin setelah melakukan tindakan, misalnya ketika data "Berhasil disimpan" atau "Gagal dihapus".
- **`@panzoom/panzoom`**: Library interaktif untuk fitur *panning* (menggeser) dan *zooming* (memperbesar/memperkecil) elemen DOM, terutama digunakan untuk memperkaya fitur preview galeri gambar di website.

---

## 🛠️ Cara Menjalankan Proyek (Setup & Development)

Pastikan Anda telah menginstal `Node.js` dan manajer paket seperti `pnpm` atau `npm`.

### 1. Instalasi Dependensi

```bash
# Menggunakan pnpm (disarankan):
pnpm install

# Atau menggunakan npm:
npm install
```

### 2. Konfigurasi Lingkungan (Environment Variables)

Buat file `.env` di *root* direktori proyek berdasarkan kredensial Supabase Anda. File ini dibutuhkan untuk menghubungkan aplikasi Nuxt dengan backend database Supabase.
```env
SUPABASE_URL=url_proyek_supabase_anda
SUPABASE_PUBLISHABLE_KEY=anon_key_supabase_anda
```

### 3. Server Pengembangan (Development Server)

Mulai server lokal untuk tahap pengembangan. Aplikasi dapat diakses di `http://localhost:3000`:

```bash
pnpm dev
# atau
npm run dev
```

### 4. Build Produksi (Production Build)

Untuk mem-build aplikasi agar siap di-*deploy* ke mode produksi:

```bash
pnpm build
# atau
npm run build
```

Jalankan preview lokal dari hasil build:

```bash
pnpm preview
# atau
npm run preview
```
