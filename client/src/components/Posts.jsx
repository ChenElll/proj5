import React, { useState, useEffect } from 'react';
import '../css/Posts.css';

const Posts = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/posts?userId=${user.id}`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [user.id]);

  const handleNewPostChange = (e) => {
    setNewPost(e.target.value);
  };

  const handleAddPost = async () => {
    if (newPost.trim() === '') return;

    const newPostItem = {
      userId: parseInt(user.id),
      title: newPost,
      body: '' // default empty body
    };

    try {
      const response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPostItem)
      });
      if (!response.ok) throw new Error('Failed to add post');
      setPosts([newPostItem, ...posts]);
      setNewPost('');
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h2>{user.username}'s Posts</h2>
      </div>
      <div className="add-post-container">
        <input 
          type="text" 
          value={newPost} 
          onChange={handleNewPostChange} 
          placeholder="Add a new post..." 
        />
        <button onClick={handleAddPost}>Add</button>
      </div>
      <div className="posts-list">
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="post-item">
              <span className="post-title">
                {post.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Posts;
