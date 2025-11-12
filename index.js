const express = require('express');
const path = require('path');
const crypto = require('crypto');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// 🔹 Koneksi ke database MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // ganti jika user MySQL kamu berbeda
  password: '123456',         // isi password MySQL kamu
  database: 'IPIKEY',
  port: 3309    // nama database
});

db.connect(err => {
  if (err) {
    console.error('Gagal konek ke database:', err);
    process.exit(1);
  } else {
    console.log('✅ Terhubung ke database MySQL (IPIKEY)');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🔹 Endpoint untuk membuat API key dan simpan ke DB
app.post('/create', (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000).toString(36);
  const random = crypto.randomBytes(32).toString('base64url');
  const apiKey = `sk-itumy-v1-${timestamp}_${random}`;

  // Simpan ke database
  const sql = 'INSERT INTO apikey (apikeys) VALUES (?)';
  db.query(sql, [apiKey], (err, result) => {
    if (err) {
      console.error('❌ Gagal menyimpan ke DB:', err);
      return res.status(500).json({ message: 'Gagal menyimpan API key' });
    }
    console.log('✅ API key tersimpan di database');
    res.json({ apiKey });
  });
});





app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});

