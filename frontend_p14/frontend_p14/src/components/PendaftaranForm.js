// src/components/PendaftaranForm.js
import React, { useState } from 'react';

function PendaftaranForm({ token }) {
  const [formData, setFormData] = useState({
    nama: '',
    nim: '',
    judul: '',
    pembimbing:'',
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    const token = localStorage.getItem('token');
    console.log(token);

    try {
      const res = await fetch('http://localhost:3012/api/daftar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal mendaftar');
      }

      setSuccess(true);
      setFormData({ nama: '', nim: '', judul: '', pembimbing:'' });
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {success && <div className="alert alert-success">Pendaftaran berhasil!</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label htmlFor="nama" className="form-label">Nama</label>
        <input
          type="text"
          className="form-control"
          id="nama"
          name="nama"
          value={formData.nama}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="nim" className="form-label">NIM</label>
        <input
          type="text"
          className="form-control"
          id="nim"
          name="nim"
          value={formData.nim}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="judul" className="form-label">Judul Skripsi</label>
        <input
          type="text"
          className="form-control"
          id="judul"
          name="judul"
          value={formData.judul}
          onChange={handleChange}
          required
        />
      </div>

      <div className='mb-3'>
        <label htmlFor='Dosen Pembimbing' className='form-label'>Nama Dosen Pembimbing Lengkap</label>
        <input
          type='text'
          className='form-control'
          id='pembimbing'
          name='pembimbing'
          value={formData.pembimbing}
          onChange={handleChange}
          required
        />

      </div>

      <button type="submit" className="btn btn-primary">Kirim</button>
    </form>
  );
}

export default PendaftaranForm;
