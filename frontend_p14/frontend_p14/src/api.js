import axios from 'axios';
const BASE_URL = 'http://localhost:3012/api'; // ganti dengan URL backend-mu

export const loginUser = async (credentials) => {
  const response = await axios.post(`${BASE_URL}/login`, credentials);
  return response.data;
};

export const daftarSkripsi = async (token, data) => {
  const response = await axios.post(`${BASE_URL}/pendaftaran`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getPendaftar = async (token) => {
  const response = await axios.get(`${BASE_URL}/pendaftaran`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
export const getSkripsi = async (token) => {
  const response = await axios.get(`${BASE_URL}/skripsi`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};