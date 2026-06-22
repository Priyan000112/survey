# PROMPT: Website "Suara Warga Maribaya 2026" (Versi Disempurnakan)

## 1. RINGKASAN PROYEK

Buat website statis **mobile-first** untuk survei elektabilitas tokoh potensial Kepala Desa Maribaya, Kecamatan Karanganyar, Kabupaten Purbalingga.

**Nama website:** "Suara Warga Maribaya 2026"

**Tujuan:** Menampung aspirasi warga secara terbuka dan partisipatif terhadap tokoh-tokoh yang dianggap layak memimpin Desa Maribaya periode berikutnya. Netral, ringan, mudah dipahami semua kalangan usia, dan dirancang agar mudah disebarkan lewat WhatsApp.

**Target user:**
- Warga Desa Maribaya, mayoritas akses dari HP (in-app browser WhatsApp)
- Banyak pengguna usia 30+ dan lansia, sebagian tidak terlalu paham teknologi
- Koneksi internet desa kemungkinan tidak selalu stabil → wajib ringan & cepat

---

## 2. TECH STACK

- Next.js 14 (App Router), static export (`output: 'export'`)
- TailwindCSS
- TypeScript (disarankan, untuk struktur data kandidat & vote yang lebih aman)
- Tanpa database/backend — semua data tersimpan di **localStorage**
- Deploy target: Vercel (static)
- Struktur kode modular: `components/`, `lib/`, `data/`, `app/`

**Skrip wajib tersedia:**
```
npm install
npm run dev
npm run build
npm run export   # jika diperlukan terpisah dari build
```

---

## 3. DESAIN & UX

**Tema warna:**
- Hijau tua (primary, identitas desa)
- Putih (background)
- Emas (accent/CTA penting)
- Abu-abu muda (secondary/border/disabled)

**Tipografi & layout:**
- Mobile-first, breakpoint utama 360px–430px, tetap responsif wajar di tablet/desktop
- Font besar, kontras tinggi (perhatikan rasio kontras WCAG AA minimal, karena banyak pengguna lansia)
- Tombol minimal tinggi 48px, area tap nyaman
- Card vertikal, tanpa tabel, tanpa chart rumit — gunakan progress bar horizontal sederhana
- Tidak ramai, tidak "techy", formal tapi merakyat

**Komponen UX wajib:**
- Sticky CTA bawah: "Isi Survei" (muncul di Home, hilang otomatis saat user sudah di halaman Survei)
- Sticky/floating share button setelah submit survei
- Bottom navigation seperti aplikasi mobile (Home, Kandidat, Survei, Hasil, Tentang)
- Form multi-step: 1 pertanyaan per halaman/card, dengan progress bar horizontal
- Tombol "Kembali" di setiap step (jangan sampai user terjebak tanpa jalan mundur)
- Loading skeleton sederhana saat data localStorage dibaca/diagregasi (hindari flash kosong)
- **Opsi perbesar ukuran teks** (toggle "A+/A-") untuk mengakomodasi pengguna lansia — *tambahan baru*
- Halaman 404 sederhana yang tetap konsisten dengan branding

---

## 4. DATA TOKOH POTENSIAL

> Catatan penting: gunakan istilah **"tokoh potensial"**, JANGAN gunakan "calon resmi".

| No | Nama | Kategori | Tag |
|---|---|---|---|
| 1 | Tarso Dwi Cahyanto | Petahana | Pengalaman, Pemerintahan, Pembangunan |
| 2 | Kyai Maskur Jalaludin | Tokoh Agama | Pendidikan, Keagamaan, Moral |
| 3 | Rosikhun | Mantan Kepala Desa | Pengalaman, Pemerintahan, Pembangunan Desa |
| 4 | Darkum | Warga Sipil | Sosial, Warga, Akar Rumput |
| 5 | Mukhlis | Warga Sipil | Pemuda, Digitalisasi, Transparansi |
| 6 | Jamal | Kepala Dusun 2 | Pelayanan, Dusun, Pemerintahan |
| 7 | Tarom | Pengusaha | Ekonomi, UMKM, Lapangan Kerja |

**Gap yang perlu diisi (belum ada di prompt awal):**
- Setiap tokoh butuh **deskripsi singkat 1–2 kalimat** (netral, tidak menjatuhkan/mengunggulkan) untuk ditampilkan di Kandidat Page. Jika data asli belum tersedia, gunakan placeholder netral seperti: *"Dikenal warga melalui aktivitasnya di bidang [kategori]. Deskripsi lengkap menyusul."*
- Data tokoh sebaiknya disimpan terpisah di `data/candidates.ts` (bukan hardcode di komponen) agar mudah diubah tanpa menyentuh logic.

---

## 5. STRUKTUR HALAMAN

### 5.1 Home
- Hero: judul "Suara Warga Maribaya 2026", subjudul pertanyaan utama survei
- Tombol: "Isi Survei Sekarang", "Lihat Hasil Sementara"
- Badge: 100% Anonim, Tidak perlu login, ±1 menit selesai
- Total responden (live dari localStorage)
- Section "Kenapa survei ini dibuat?"
- Section "Isu utama warga" (list 9 isu)
- Sticky CTA: "Isi Survei"

### 5.2 Kandidat
- Card per tokoh: avatar inisial, nama, kategori, tag, deskripsi singkat
- Label kecil: "Tokoh potensial, belum tentu calon resmi"
- Scroll vertikal, card besar dan mudah dibaca

### 5.3 Survei (multi-step, 1 pertanyaan/step)
1. Tokoh paling layak memimpin (pilih 1 dari 7)
2. Head-to-head: 2 kandidat random vs random
3. Isu paling penting (9 pilihan)
4. Dusun (Dusun 1/2/3/Luar Maribaya)
5. Usia (17–25/26–35/36–50/50+)
6. Kepuasan terhadap pemerintahan desa saat ini (4 skala)

**Setelah submit:**
- Simpan ke localStorage
- Cegah duplicate vote dari browser yang sama (flag di localStorage, misal `hasVoted: true`)
- Tampilkan pesan terima kasih
- Tampilkan share button (WhatsApp) + copy link
- Soft-share prompt: "Bagikan ke keluarga dan tetangga agar hasil lebih akurat."

**Hal yang perlu ditambahkan (gap):**
- **Validasi:** jika user menutup browser di tengah jalan, progres step *tidak perlu* disimpan permanen (anggap mulai ulang) — sebutkan ini secara eksplisit agar developer tidak salah asumsi.
- **Tombol "Lewati"** untuk pertanyaan non-esensial (misal head-to-head) agar tidak ada drop-off karena merasa dipaksa.
- Jelaskan **apa yang terjadi jika localStorage di-disable/private browsing** (in-app WA browser kadang membatasi storage) — sediakan fallback pesan: "Mode privat terdeteksi, suara mungkin tidak tersimpan."

### 5.4 Hasil
- Elektabilitas sementara (progress bar + persentase + total suara)
- Top issue warga
- Distribusi responden per dusun
- Distribusi usia
- Kepuasan terhadap pemerintahan saat ini
- Simulasi head-to-head
- Jika data localStorage kosong → tampilkan dummy data realistis acak, **dengan komentar kode**: `// hapus dummy data saat production`
- Disclaimer besar: "Hasil ini bukan hasil resmi pemilihan kepala desa. Ini hanya survei aspirasi warga berbasis partisipasi online."

**Gap penting yang perlu ditambahkan:**
- **Disclaimer ukuran sampel**: karena ini berbasis localStorage per-device (bukan server), hasil hanya mencerminkan device yang dipakai untuk membuka halaman Hasil itu sendiri — bukan agregat dari semua warga yang sudah mengisi survei di device lain. Ini **harus** dijelaskan secara jujur ke user, idealnya dengan kalimat seperti: *"Hasil yang ditampilkan saat ini berdasarkan data di perangkat Anda. Untuk hasil gabungan seluruh warga, dibutuhkan mekanisme pengumpulan data terpusat."* — Ini adalah keterbatasan teknis fundamental dari pendekatan "tanpa backend" yang perlu disampaikan ke pemilik proyek, bukan disembunyikan.

### 5.5 Tentang
- Penjelasan independensi (tidak mewakili panitia Pilkades/pemerintah desa/kandidat manapun)
- Tidak meminta NIK, nomor HP, alamat detail, atau data pribadi sensitif
- Jawaban anonim

---

## 6. PRIVASI & INTEGRITAS DATA

- Tidak mengumpulkan PII (NIK, no. HP, alamat detail)
- Jelaskan secara tertulis di About bahwa data tersimpan lokal di perangkat masing-masing, bukan di server pusat
- Karena tanpa backend, satu orang secara teknis bisa vote berulang dengan clear localStorage / mode privat / device lain — **ini limitasi yang wajar untuk skala survei informal RT/desa**, tapi sebutkan di About sebagai bentuk transparansi, contoh: *"Survei ini bersifat partisipatif dan informal; sistem mencegah duplikasi pada perangkat yang sama, namun bukan sistem verifikasi identitas resmi."*

---

## 7. SEO & METADATA

- Title: "Suara Warga Maribaya 2026"
- Meta description: "Survei aspirasi warga Desa Maribaya untuk menentukan tokoh potensial kepala desa periode berikutnya."
- **Tambahan yang perlu dilengkapi:** Open Graph image (untuk preview saat link dibagikan ke WhatsApp/grup — penting karena tujuan utama adalah viral via WA), favicon, `theme-color` meta tag sesuai hijau tua brand.

---

## 8. PERFORMA

- Static export, no backend, no database
- Optimized image (gunakan `next/image` jika kompatibel dengan static export, atau format ringan seperti SVG/WebP untuk avatar placeholder)
- Hindari font eksternal berat; gunakan system font atau font Google yang di-subset

---

## 9. BAHASA & PENAMAAN

- Semua teks Bahasa Indonesia
- Konsisten gunakan "tokoh potensial", jangan "calon resmi"
- Nada bahasa: formal tapi merakyat, hindari jargon teknis di sisi user-facing copy

---

## 10. CATATAN UNTUK DEVELOPER (gap tambahan dari prompt asli)

1. Definisikan skema data localStorage secara eksplisit, contoh:
   ```ts
   type VoteRecord = {
     candidateId: string;
     headToHeadWinnerId: string;
     issue: string;
     dusun: string;
     ageGroup: string;
     satisfaction: string;
     timestamp: number;
   }
   ```
2. Sebutkan strategi agregasi: dihitung saat halaman Hasil dimuat (client-side), bukan pre-rendered, karena data ada di localStorage masing-masing device.
3. Sertakan checklist aksesibilitas dasar: alt text avatar, label form yang jelas, navigasi via keyboard tetap berfungsi (untuk yang akses dari desktop juga).
4. Jelaskan ke pemilik proyek (bukan hanya developer) bahwa pendekatan "tanpa backend" cocok untuk uji coba/MVP skala kecil, tapi punya keterbatasan agregasi data lintas-device seperti dijelaskan di bagian 5.4 — supaya tidak ada ekspektasi keliru soal "hasil real-time gabungan semua warga".
