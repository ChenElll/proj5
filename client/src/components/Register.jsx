import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== verifyPassword) {
      alert('Passwords do not match');
      return;
    }

    const response = await axios.get('http://localhost:3000/users');
    const users = response.data;

    const userExists = users.some((u) => u.username === username);

    if (userExists) {
      alert('Username already exists');
    } else {
      const newUser = {
        id: users.length + 1,
        username: username,
        website: password,
        email: `${username}@example.com`, // שימוש במייל דמיוני עבור המשתמש החדש
      };
      await axios.post('http://localhost:3000/users', newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      navigate('/home');
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Verify Password"
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      <a href="/login">Already have an account? Login</a>
    </div>
  );
};

export default Register;
