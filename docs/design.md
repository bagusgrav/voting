# Dokumen Desain — Voting Auditability Tool

**Status:** rancangan awal v0.1. Proyek ini adalah alat edukasi dan referensi, bukan sistem pemilu produksi.

## Masalah

Dalam pemungutan suara digital, pemilih dan pengamat sulit memastikan bahwa aturan pemungutan suara dipatuhi dan hasil penghitungan tidak diubah. Auditabilitas juga berhadapan dengan kebutuhan privasi: sistem perlu membatasi suara ganda tanpa membuat hubungan antara identitas seseorang dan pilihan suaranya mudah diketahui.

Proyek ini menyediakan demonstrasi kecil yang membantu menjelaskan masalah tersebut melalui kredensial buta, pemisahan identitas dari surat suara, log publik, dan verifikasi independen. Demo ini tidak membuktikan bahwa pemilihan nyata aman.

## Tujuan

- Mendemonstrasikan alur penerbitan kredensial, pemberian suara, pencatatan, dan verifikasi secara dapat dipahami.
- Memisahkan proses yang mengetahui identitas pemilih dari proses yang menerima surat suara.
- Menyediakan log yang dapat diperiksa dan data yang dapat dihitung ulang oleh verifikator independen.
- Menyatakan asumsi, batasan, serta kegagalan yang mungkin terjadi secara terbuka.

## Non-Tujuan

- Menjadi sistem pemilu pemerintah/produksi, atau menjamin kerahasiaan dan integritas pada lingkungan operasional nyata.
- Mencegah paksaan, jual-beli suara, malware pada perangkat pemilih, atau pengungkapan pilihan oleh pemilih sendiri.
- Menyediakan identitas digital, pemulihan akun, infrastruktur kunci tingkat produksi, atau tata kelola pemilihan yang lengkap.
- Mengklaim bahwa log SQLite adalah papan pengumuman yang tidak dapat diubah atau bahwa kriptografi saja menyelesaikan seluruh risiko.

## Arsitektur Kotak-kotak

```text
                         ┌──────────────────────────┐
                         │ Verifikator independen   │
                         │ validasi log & hitung    │
                         └────────────▲─────────────┘
                                      │ ekspor data publik
┌──────────┐ kredensial buta ┌────────┴─────────────┐
│ Pemilih  ├────────────────►│ Papan pengumuman /   │
│          │ surat suara     │ log                  │
└────▲─────┘────────────────►│ (API Axum, SQLite)   │
     │                       └──────────────────────┘
     │ autentikasi/kelayakan            ▲
┌────┴─────┐ penerbitan kredensial      │
│ Issuer   ├────────────────────────────┘
└──────────┘
```

Komponen berikut menjelaskan batas tanggung jawab yang dituju; sebagian masih berupa rencana.

- **Issuer (penerbit):** memeriksa kelayakan pemilih dan menerbitkan kredensial menggunakan protokol tanda tangan buta. Issuer mengetahui identitas/kelayakan, tetapi tidak seharusnya dapat mengaitkan kredensial yang sudah diteken dengan surat suara yang kemudian diserahkan. Detail protokol dan perlindungan implementasinya perlu ditentukan sebelum klaim keamanan dibuat.
- **Papan pengumuman / log:** API Rust dengan Axum menerima surat suara yang membawa bukti kredensial yang sah, menolak kredensial yang sudah digunakan, lalu mencatat surat suara dan peristiwa yang diperlukan. SQLite adalah penyimpanan demo, bukan jaminan append-only dengan sendirinya. Ekspor publik harus menghindari data identitas.
- **Pemilih:** melalui antarmuka Next.js meminta kredensial, membuat surat suara, dan menyerahkannya secara terpisah dari proses pemeriksaan identitas. Pemilih dapat menyimpan bukti penerimaan untuk memeriksa bahwa surat suaranya tercatat; bukti tidak boleh membocorkan pilihan kepada pihak lain.
- **Verifikator:** program Python yang berdiri sendiri memeriksa ekspor log, validitas bukti sesuai format yang ditentukan, keunikan kredensial, dan menghitung ulang hasil. Verifikator tidak mempercayai tally yang diberikan API. Pemeriksaan ini hanya sekuat format, algoritme, dan data yang tersedia.

Alur demo yang dituju: issuer menerbitkan kredensial; pemilih menyerahkan surat suara; log menyediakan catatan untuk diperiksa; lalu verifikator independen memvalidasi catatan dan menghitung hasil. Implementasi harus mendokumentasikan format data dan asumsi agar pemeriksaan dapat direproduksi.
