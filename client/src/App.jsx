import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import CompleteProfile from './components/CompleteProfile';
import Todos from './components/Todos';
import Posts from './components/Posts';
import Albums from './components/Albums';
import AlbumDetails from './components/AlbumDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/info" element={<div>Info Page</div>} />
        <Route path="/users/:userId/todos" element={<Todos />} />
        <Route path="/users/:userId/posts" element={<Posts />} />
        <Route path="/users/:userId/posts/:postId" element={<Posts />} />
        <Route path="/users/:userId/albums" element={<Albums />} />
        <Route path="/users/:userId/albums/:id" element={<AlbumDetails />} />
        <Route path="/" element={<Login />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
