import React, { useEffect, useState } from 'react';

function PendaftarList({ token }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3012/api/pendaftar', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(setData);
  }, [token]);

  return (
    <div className="container mt-4">
      <h2>Daftar Pendaftar</h2>
      <ul className="list-group">
        {data.map((item, i) => (
          <li key={i} className="list-group-item">
            {item.nama} - {item.nim} - {item.judul} - {item.pembimbing}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PendaftarList;
