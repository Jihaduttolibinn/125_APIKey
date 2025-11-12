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


app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});

