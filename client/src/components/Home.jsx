import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container">
      <h2>Welcome, {user.username}</h2>
      <nav className="navbar">
        <ul>
          <li><Link to="/info">Info</Link></li>
          <li><Link to="/todos">Todos</Link></li>
          <li><Link to="/posts">Posts</Link></li>
          <li><Link to="/albums">Albums</Link></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>
      <div className="content">
        <h3>Home Page Content</h3>
      </div>
    </div>
  );
};

export default Home;
