import React, { useEffect, useState } from 'react';

function PendaftarSkripsi({ token }) {
  // State untuk menyimpan satu objek skripsi, atau null jika tidak ada/belum diambil
  const [skripsiData, setSkripsiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Opsional: untuk loading state
  const [error, setError] = useState(null);        // Opsional: untuk error state

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      // Anda mungkin ingin menampilkan pesan bahwa token tidak ada
      return;
    }

    setIsLoading(true);
    setError(null);

    fetch('http://localhost:3012/api/skripsi', { // URL disamakan dengan backend ('s' kecil)
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) {
        // Jika status error (mis. 404 Not Found atau 403 jika token salah)
        if (res.status === 404) {
          // Tidak ada skripsi, ini bukan error aplikasi, tapi data tidak ada
          return null; // Atau Anda bisa melempar error spesifik jika mau
        }
        throw new Error(`Gagal mengambil data: ${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then(data => {
      setSkripsiData(data); // Simpan objek skripsi (atau null jika 404 dihandle di atas)
    })
    .catch(err => {
      console.error("Error fetching skripsi data:", err);
      setError(err.message);
      setSkripsiData(null); // Reset data jika error
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [token]); // Dependency array

  if (isLoading) {
    return <div className="container mt-4"><p>Memuat data skripsi...</p></div>;
  }

  if (error) {
    return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;
  }

  // Jika skripsiData ada (tidak null), tampilkan detailnya
  if (skripsiData) {
    return (
      <div className="container mt-4">
        <h2>Skripsi Anda</h2>
        <ul className="list-group">
          <li className="list-group-item"><strong>Nama:</strong> {skripsiData.nama}</li>
          <li className="list-group-item"><strong>NIM:</strong> {skripsiData.nim}</li>
          <li className="list-group-item"><strong>Judul:</strong> {skripsiData.judul}</li>
          <li className="list-group-item"><strong>Pembimbing:</strong> {skripsiData.pembimbing}</li>
          {/* Tambahkan properti lain jika ada, misal tanggal submit */}
          {skripsiData.createdAt && (
            <li className="list-group-item">
              <strong>Tanggal Submit:</strong> {new Date(skripsiData.createdAt).toLocaleDateString('id', {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                  })}
            </li>
          )}
        </ul>
      </div>
    );
  }

  // Jika skripsiData null (misalnya, pengguna belum submit skripsi)
  return (
    <div className="container mt-4">
      <h2>Skripsi Anda</h2>
      <p>Anda belum mensubmit data skripsi.</p>
      {/* Anda bisa menambahkan tombol/link untuk ke halaman submit di sini */}
    </div>
  );
}

export default PendaftarSkripsi;