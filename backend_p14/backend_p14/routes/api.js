const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Skripsi, User } = require('../models');
const auth = require('../middleware/auth');
const { where } = require('sequelize');

// Register user
router.post('/register', async (req, res) => {
  try {
    const { nim, nama, password } = req.body;
    const existing = await User.findOne({ where: { nim } });
    if (existing) return res.status(409).json({ message: 'NIM sudah terdaftar' });

    const user = await User.create({ nim, nama, password });
    res.json({ message: 'Registrasi berhasil' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { nim, password } = req.body;
  const user = await User.findOne({ where: { nim } });

  if (!user) return res.status(404).json({ message: 'NIM tidak ditemukan' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Password salah' });

  const token = jwt.sign({ nim: user.nim, nama: user.nama }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

// Submit skripsi (auth)
router.post('/daftar', auth, async (req, res) => {
  try {
    const authenticatedUserNIM = req.user.nim;
    if (!authenticatedUserNIM) {
      return res.status(403).json({ message: 'NIM pengguna tidak ditemukan dari token otentikasi.' });
    }
    const existingSkripsi = await Skripsi.findOne({
      where: {
        nim: authenticatedUserNIM // Cek berdasarkan NIM pengguna yang sedang login
      }
    });
    if (existingSkripsi) {
      // Jika sudah ada, kirim pesan error beserta tanggal submit
      const submissionDate = new Date(existingSkripsi.createdAt).toLocaleDateString('id', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      return res.status(409).json({ 
        message: `Maaf, Anda dengan NIM ${authenticatedUserNIM} sudah mensubmit skripsi Anda pada tanggal ${submissionDate}.`
      });
    }
    const { nama, nim, judul, pembimbing } = req.body;
    if (nim !== authenticatedUserNIM) {
      return res.status(403).json({
        message: `NIM pada form (${nim}) tidak sesuai dengan NIM Anda yang terotentikasi (${authenticatedUserNIM}). Anda hanya dapat mensubmit skripsi untuk diri sendiri.`
      });
    }
    const pendaftaran = await Skripsi.create({ 
      nama, 
      nim:authenticatedUserNIM, 
      judul, 
      pembimbing,
    });
    res.status(201).json({ message: 'Skripsi berhasil disubmit!', data: pendaftaran });

  } catch (err) {
    console.error('ERROR SAAT SUBMIT SKRIPSI:', err);
    res.status(500).json({
      message: 'Gagal memproses permintaan submit skripsi.',
      error: err.message
    });
  }
});

// Get all pendaftar (auth)
router.get('/pendaftar', auth, async (req, res) => {
  const data = await Skripsi.findAll();
  res.json(data);
});
//get skripsi pendaftar (auth)
router.get('/skripsi', auth, async (req, res) => {
  try {
    const authenticatedUserNIM = req.user.nim;

    if (!authenticatedUserNIM) {
      return res.status(403).json({ message: 'NIM pengguna tidak ditemukan dari token otentikasi.' });
    }
    const skripsiData = await Skripsi.findOne({ // Menggunakan Skripsi.findOne
      where: {
        nim: authenticatedUserNIM
      }
    });

    if (skripsiData) {
      res.json(skripsiData); 
    } else {
      res.status(404).json({ message: `Tidak ditemukan data skripsi untuk NIM ${authenticatedUserNIM}.` });
    }

  } catch (err) {
    console.error('ERROR SAAT MENGAMBIL SKRIPSI:', err);
    res.status(500).json({
      message: 'Gagal mengambil data skripsi.',
      error: err.message
    });
  }
});

module.exports = router;
