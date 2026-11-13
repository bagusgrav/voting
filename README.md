# Voting Auditability Tool

**Status: rancangan dan prototipe awal v0.1.** Ini adalah alat edukasi dan referensi untuk mendemonstrasikan auditabilitas pemungutan suara digital, bukan sistem pemilu produksi.

## Apa ini?

Proyek ini mengeksplorasi cara menerbitkan kredensial buta, memisahkan identitas pemilih dari surat suara, mencatat suara dalam log yang dapat diperiksa, dan memverifikasi hasil dengan program independen. Rancangan arsitektur dan batas tanggung jawab komponen dijelaskan di [docs/design.md](docs/design.md); cakupan ancaman serta hal-hal yang belum ditangani ada di [docs/threat-model.md](docs/threat-model.md).

## Mengapa dibuat?

Auditabilitas dan privasi sulit diseimbangkan dalam pemungutan suara digital. Proyek ini dibuat sebagai demonstrasi yang dapat dipelajari dan diperiksa—untuk membantu menjelaskan asumsi dan batasan teknis, bukan untuk menyatakan bahwa pemilihan digital sudah aman.

## Prinsip

- **Kode dan proses terbuka:** desain serta implementasi dimaksudkan untuk dapat diperiksa dan diverifikasi secara independen.
- **Jujur soal batasan:** prototipe, hasil verifikasi, dan kriptografi tidak membuktikan keamanan menyeluruh. Klaim harus mengikuti kemampuan implementasi yang benar-benar ada.
- **Pemisahan tanggung jawab:** penerbit kredensial, pencatatan surat suara, dan verifikasi hasil memiliki peran berbeda.
- **Tidak untuk pemilu nyata:** jangan gunakan untuk pemilihan sungguhan atau data pemilih sensitif.

## Teknologi yang direncanakan

- Backend dan kriptografi: Rust dengan Axum.
- Verifikator independen: Python.
- Antarmuka: Next.js dengan TypeScript.
- Penyimpanan demo: SQLite.

## Menjalankan demo

Demo end-to-end belum tersedia. Saat ini repositori masih berada pada tahap rancangan/prototipe awal, sehingga belum ada perintah yang dapat menjalankan alur pemungutan suara. Setelah implementasi tersedia, petunjuk ini akan diperbarui dengan prasyarat dan perintah yang sudah diuji. Alur demo yang dituju:

1. Jalankan layanan API lokal.
2. Buka antarmuka pemilih dan lakukan alur penerbitan kredensial serta penyerahan surat suara contoh.
3. Ekspor log publik yang dihasilkan.
4. Jalankan verifikator Python terhadap ekspor tersebut dan bandingkan hasil hitung ulang.

Jangan menganggap keluaran API atau verifikator sebagai jaminan keamanan pemilu.
