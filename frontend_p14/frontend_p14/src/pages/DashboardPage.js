// src/pages/DashboardPage.js
import React, { useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import PendaftaranForm from '../components/PendaftaranForm';
import PendaftarList from '../components/PendaftarList';
import PendaftarSkripsi from '../components/PendaftarSkripsi';

function DashboardPage() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return jwtDecode(token);
    } catch (err) {
      console.error('Token invalid:', err);
      return { nama: '' };
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload(); // Optional: reset state, bersihkan data
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Selamat datang, {user.nama}</h4>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>
      <div className='mb-3'>
        <h3>Skripsi yang sudah kamu submit dan tidak bisa submit kembali</h3>
        <PendaftarSkripsi token={token}/>
      </div>
      <div className="mb-5">
        <h2>Form Pendaftaran Skripsi</h2>
        <PendaftaranForm token={token} />
      </div>

      <hr />

      <PendaftarList token={token} />
    </div>
  );
}

export default DashboardPage;
