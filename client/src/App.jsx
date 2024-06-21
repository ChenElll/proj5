import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/info" element={<div>Info Page</div>} />
        <Route path="/todos" element={<div>Todos Page</div>} />
        <Route path="/posts" element={<div>Posts Page</div>} />
        <Route path="/albums" element={<div>Albums Page</div>} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
