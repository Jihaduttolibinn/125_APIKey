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

app.post('/checkapi', (req, res) => {
  const { apikey } = req.body;

  if (!apikey) {
    return res.status(400).json({
      valid: false,
      message: 'API key tidak boleh kosong'
    });
  }

  const sql = 'SELECT * FROM apikey WHERE apikeys = ? LIMIT 1';
  db.query(sql, [apikey], (err, results) => {
    if (err) {
      console.error('❌ Error saat cek DB:', err);
      return res.status(500).json({ message: 'Terjadi kesalahan server' });
    }

    if (results.length > 0) {
      res.json({
        valid: true,
        message: 'API key valid',
        data: { apikey }
      });
    } else {
      res.status(401).json({
        valid: false,
        message: 'API key tidak valid atau tidak ditemukan'
      });
    }
  });
});






app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});

