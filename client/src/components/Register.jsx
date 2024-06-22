import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [verifyPasswordError, setVerifyPasswordError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setUsernameError('');
    setPasswordError('');
    setVerifyPasswordError('');

    if (password !== verifyPassword) {
      setVerifyPasswordError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/users');
      const users = await response.json();

      const userExists = users.some((u) => u.username === username);

      if (userExists) {
        setUsernameError('Username already exists');
      } else {
        const newUser = {
          id: (users.length + 1).toString(),
          name: "",
          username: username,
          email: `${username}@example.com`,
          address: {
            street: "",
            suite: "",
            city: "",
            zipcode: "",
            geo: {
              lat: "",
              lng: ""
            }
          },
          phone: "",
          website: password, // acting as password
          company: {
            name: "",
            catchPhrase: "",
            bs: ""
          }
        };

        const postResponse = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newUser)
        });

        if (!postResponse.ok) {
          throw new Error('Failed to register user');
        }

        localStorage.setItem('newUser', JSON.stringify(newUser));
        navigate('/complete-profile');
      }
    } catch (error) {
      console.error('Error during registration:', error);
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
        {usernameError && <div className="error">{usernameError}</div>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <div className="error">{passwordError}</div>}
        <input
          type="password"
          placeholder="Verify Password"
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
        />
        {verifyPasswordError && <div className="error">{verifyPasswordError}</div>}
        <button type="submit">Register</button>
      </form>
      <a href="/login">Already have an account? Login</a>
    </div>
  );
};

export default Register;
