# Verifikator Independen

Pastikan server Axum berjalan di `http://localhost:3000`, lalu dari folder `verifier/` jalankan:

```powershell
pip install -r requirements.txt
python verifier.py
```

Skrip mengambil data dari endpoint `/results`, memeriksa nullifier duplikat, dan menghitung total surat suara terenkripsi. Proses keluar dengan status gagal jika data tidak dapat diambil atau audit menemukan nullifier duplikat.
