# Model Ancaman — Voting Auditability Tool v0.1

**Status:** cakupan dan batasan rancangan. Ini bukan evaluasi keamanan atas implementasi produksi.

## Aset dan asumsi

Aset utama adalah keunikan suara yang diterima, integritas catatan suara/log, dan tidak adanya tautan langsung antara identitas pemilih dengan pilihannya. Rancangan mengasumsikan ada pemilihan demo dengan aturan dan format surat suara yang ditetapkan sebelumnya. Issuer dan layanan pencatatan merupakan komponen terpisah secara logis; pemisahan ini sendiri tidak menjamin keduanya tidak berkolusi.

## Ancaman yang ingin dikurangi

- **Double voting:** pemegang kredensial mencoba menyerahkan suara lebih dari sekali. Layanan pencatatan seharusnya mengenali penggunaan ulang kredensial dan menolak pengiriman berikutnya; verifikator memeriksa duplikasi dalam log.
- **Kredensial palsu atau surat suara tidak sah:** penyerang mengirim suara tanpa otorisasi. Layanan dan verifikator seharusnya memeriksa bukti kredensial dan validitas surat suara menurut aturan demo.
- **Manipulasi tally atau penghilangan/pengubahan catatan:** operator atau kesalahan perangkat lunak mengubah hasil yang ditampilkan. Log yang dapat diekspor dan verifikator Python yang independen memungkinkan penghitungan ulang serta perbandingan hasil. Ini dapat mengungkap ketidaksesuaian pada data yang diperiksa, tetapi tidak membuktikan bahwa semua suara yang seharusnya masuk memang tercatat.
- **Pengaitan identitas dengan pilihan melalui alur normal:** desain memisahkan pemeriksaan kelayakan oleh issuer dari penyerahan surat suara dan menggunakan kredensial buta sebagai demonstrasi. Ini mengurangi tautan langsung yang dibuat aplikasi, tetapi tidak melindungi dari kolusi, metadata jaringan, waktu pengiriman, atau implementasi kriptografi yang cacat.

## Belum diselesaikan di v0.1

- **Paksaan, coercion, dan jual-beli suara:** pemilih dapat dipaksa menunjukkan pilihan atau menyerahkan kredensial. Tidak ada mekanisme pemungutan suara ulang yang aman atau deniability yang menjamin pilihan bebas.
- **Malware/perangkat pemilih yang disusupi:** antarmuka dapat menampilkan pilihan berbeda dari yang dikirim, atau mencuri rahasia.
- **Kolusi issuer dan operator log, korelasi metadata, serta analisis waktu:** pemisahan komponen tidak menghilangkan risiko ini.
- **Ketersediaan dan sensor:** operator dapat mematikan layanan, menolak suara, atau menunda publikasi; demo tidak menyediakan transparansi terdistribusi atau mekanisme pemulihan.
- **Perusakan basis data dan kompromi kunci:** SQLite dapat diubah oleh pihak yang memiliki akses tulis, dan manajemen kunci produksi belum menjadi tujuan.
- **Serangan implementasi/operasional:** bug, dependensi berbahaya, kesalahan konfigurasi, kebocoran data, dan serangan denial-of-service belum ditangani sebagai sistem produksi.

## Batas kepercayaan dan penggunaan

Jangan gunakan v0.1 untuk pemilihan nyata atau data pemilih sensitif. Hasil verifikasi hanya menunjukkan bahwa data yang diberikan lolos pemeriksaan yang diimplementasikan; hasil itu bukan bukti keamanan menyeluruh, kerahasiaan pilihan, atau kelengkapan log. Klaim dan mitigasi harus diperbarui ketika protokol, format ekspor, serta implementasi tersedia dan ditinjau.
