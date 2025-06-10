import React from 'react';
import LoginForm from '../components/LoginForm';

function LoginPage({ setToken }) {
  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <LoginForm setToken={setToken} />
    </div>
  );
}

export default LoginPage;
