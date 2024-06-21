import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setUsernameError('');
    setPasswordError('');

    const response = await axios.get('http://localhost:3000/users');
    const users = response.data;

    const user = users.find((u) => u.username === username);

    if (!user) {
      setUsernameError('Username not found');
    } else if (user.website !== password) { // website acting as password
      setPasswordError('Incorrect password');
    } else {
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/home');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {usernameError && <div className="error">{usernameError}</div>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <div className="error">{passwordError}</div>}
        <button type="submit">Login</button>
      </form>
      <a href="/register">Don't have an account? Register</a>
    </div>
  );
};

export default Login;
