import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginForm({ setToken }) {
  // State form dengan properti nim dan password
  const [form, setForm] = useState({ nim: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Update state form setiap input berubah
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form login
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3012/api/login', form);
      const token = res.data.token;
      localStorage.setItem('token', token);
      setToken(token); 
      navigate('/dashboard');
    } catch (err) {
      setError('Login gagal. Periksa NIM/password.');
    }
  };



  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label>NIM</label>
        <input
          name="nim"
          className="form-control"
          value={form.nim}
          onChange={handleChange}
          required
          autoComplete="username"
        />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-primary" type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
