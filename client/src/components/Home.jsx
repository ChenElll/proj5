import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserInfo from './UserInfo';
import '../css/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [showUserInfo, setShowUserInfo] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleShowUserInfo = (e) => {
    e.preventDefault();
    setShowUserInfo(true);
  };

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <nav className="navbar">
          <ul>
            <li>
              <a href="#" onClick={handleShowUserInfo}>Info</a>
            </li>
            <li>
              <Link to={`/users/${user.id}/todos`}>Todos</Link>
            </li>
            <li>
              <Link to={`/users/${user.id}/posts`}>Posts</Link>
            </li>
            <li>
              <Link to={`/users/${user.id}/albums`}>Albums</Link>
            </li>
          </ul>
        </nav>
        <div className="content">
          {showUserInfo ? (
            <UserInfo user={user} />
          ) : (
            <>
              <h2>Hello, {user.username}</h2>
              <h3>Welcome to your page</h3>
            </>
          )}
        </div>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Home;
