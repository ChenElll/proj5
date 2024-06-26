import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Posts.css';
import { v4 as uuidv4 } from 'uuid';

const Posts = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [posts, setPosts] = useState([]);
  const [searchCriterion, setSearchCriterion] = useState('serial');
  const [searchTerm, setSearchTerm] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPostTitle, setEditingPostTitle] = useState('');
  const [editingPostBody, setEditingPostBody] = useState('');
  const [newCommentBody, setNewCommentBody] = useState('');
  const [showAddComment, setShowAddComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentBody, setEditingCommentBody] = useState('');

  const navigate = useNavigate(); // הוספת הוק הניווט

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/posts?userId=${user.id}`);
        const data = await response.json();
        setPosts(data.sort((a, b) => b.id - a.id)); // מוודא שהפוסטים מסודרים מהחדש לישן
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [user.id]);

  const handleSearchCriterionChange = (e) => {
    setSearchCriterion(e.target.value);
    setSearchTerm('');
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleNewPostTitleChange = (e) => {
    setNewPostTitle(e.target.value);
  };

  const handleNewPostBodyChange = (e) => {
    setNewPostBody(e.target.value);
  };

  const getNewId = async () => {
    try {
      const response = await fetch(`http://localhost:3000/posts`);
      const data = await response.json();
      const maxId = data.reduce((max, post) => Math.max(max, parseInt(post.id, 10)), 0);
      return maxId + 1;
    } catch (error) {
      console.error('Error fetching posts:', error);
      const maxId = posts.reduce((max, post) => Math.max(max, parseInt(post.id, 10)), 0);
      return maxId + 1; // fallback in case of error
    }
  };

  const handleAddPost = async () => {
    if (newPostTitle.trim() === '' || newPostBody.trim() === '') return;

    const newPostId = await getNewId();
    const newPost = {
      userId: parseInt(user.id),
      id: newPostId.toString(),
      title: newPostTitle,
      body: newPostBody,
    };

    try {
      const response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
      });
      if (!response.ok) throw new Error('Failed to add post');
      setPosts(prevPosts => [newPost, ...prevPosts].sort((a, b) => b.id - a.id)); // הוספת הפוסט החדש לראש הרשימה ושמירה על הסדר
      setNewPostTitle('');
      setNewPostBody('');
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete post');
      setPosts(posts.filter(post => post.id !== id));
      if (selectedPost && selectedPost.id === id) {
        setSelectedPost(null);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleUpdatePost = async (id) => {
    if (editingPostTitle.trim() === '' || editingPostBody.trim() === '') return;

    const updatedPost = {
      ...posts.find(post => post.id === id),
      title: editingPostTitle,
      body: editingPostBody
    };

    try {
      const response = await fetch(`http://localhost:3000/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPost)
      });
      if (!response.ok) throw new Error('Failed to update post');
      setPosts(posts.map(post => (post.id === id ? updatedPost : post)));
      // לשמור על התגובות הקיימות תחת הפוסט
      setSelectedPost({ ...updatedPost, comments: selectedPost.comments });
      setEditingPostId(null);
      setEditingPostTitle('');
      setEditingPostBody('');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const startEditingPost = (post) => {
    setEditingPostId(post.id);
    setEditingPostTitle(post.title);
    setEditingPostBody(post.body);
  };

  const handleSelectPost = async (post) => {
    setSelectedPost(post);
    setShowAddComment(false);

    try {
      const response = await fetch(`http://localhost:3000/comments?postId=${post.id}`);
      const comments = await response.json();
      setSelectedPost({ ...post, comments });
      navigate(`/users/${user.id}/posts/${post.id}`); // הוספת הניווט ל-URL עם postId
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleNewCommentBodyChange = (e) => {
    setNewCommentBody(e.target.value);
  };

  const handleAddComment = async () => {
    if (!selectedPost || newCommentBody.trim() === '') return;

    const newCommentData = {
      postId: parseInt(selectedPost.id),
      id: uuidv4(), // יצירת UUID לתגובה
      name: user.username,
      email: user.email,
      body: newCommentBody
    };

    try {
      const response = await fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCommentData)
      });
      if (!response.ok) throw new Error('Failed to add comment');
      setSelectedPost({
        ...selectedPost,
        comments: [newCommentData, ...(selectedPost.comments || [])] // הוספת התגובה החדשה לראש הרשימה
      });
      setNewCommentBody('');
      setShowAddComment(false);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete comment');
      setSelectedPost({
        ...selectedPost,
        comments: selectedPost.comments.filter(comment => comment.id !== commentId)
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (editingCommentBody.trim() === '') return;

    const updatedComment = {
      ...selectedPost.comments.find(comment => comment.id === commentId),
      body: editingCommentBody
    };

    try {
      const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedComment)
      });
      if (!response.ok) throw new Error('Failed to update comment');
      setSelectedPost({
        ...selectedPost,
        comments: selectedPost.comments.map(comment => (comment.id === commentId ? updatedComment : comment))
      });
      setEditingCommentId(null);
      setEditingCommentBody('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const startEditingComment = (commentId, commentBody) => {
    setEditingCommentId(commentId);
    setEditingCommentBody(commentBody);
  };

  const getLocalIndex = (id) => {
    const sortedPosts = [...posts]; // שמירה על הסדר הנוכחי של הפוסטים
    return sortedPosts.findIndex(post => post.id === id) + 1;
  };

  const filterPosts = (posts) => {
    const filteredPosts = posts.filter((post) => {
      switch (searchCriterion) {
        case 'serial':
          return getLocalIndex(post.id).toString().includes(searchTerm);
        case 'title':
          return post.title.toLowerCase().includes(searchTerm.toLowerCase());
        default:
          return true;
      }
    });
    return filteredPosts; // שמירה על הסדר הנכון של הפוסטים
  };

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h2>{user.username}'s Posts</h2>
        <div className="search-sort-container">
          <select onChange={handleSearchCriterionChange} value={searchCriterion}>
            <option value="serial">Serial</option>
            <option value="title">Title</option>
          </select>
          <input
            type="text"
            onChange={handleSearchTermChange}
            value={searchTerm}
            placeholder="Search..."
            list="suggestions"
          />
          <datalist id="suggestions">
            {posts.map((post, index) => (
              <option key={index} value={getLocalIndex(post.id).toString()} />
            ))}
          </datalist>
        </div>
      </div>
      <div className="add-post-container">
        <input
          type="text"
          value={newPostTitle}
          onChange={handleNewPostTitleChange}
          placeholder="Post title..."
        />
        <textarea
          value={newPostBody}
          onChange={handleNewPostBodyChange}
          placeholder="Post body..."
        />
        <button onClick={handleAddPost}>Add Post</button>
      </div>
      <div className="posts-list">
        <ul>
          {filterPosts(posts).map((post, index) => (
            <li key={post.id} className="post-item">
              <span className="post-id">{getLocalIndex(post.id)}</span>
              <span className="post-title" onClick={() => handleSelectPost(post)}>{post.title}</span>
              <img
                src="../../public/115789_trash_icon.png"
                alt="Delete"
                onClick={() => handleDeletePost(post.id)}
                className="action-icon"
              />
            </li>
          ))}
        </ul>
      </div>
      {selectedPost && (
        <div className="post-details-container">
          <div className="post-details">
            <button className="close-post-details" onClick={() => setSelectedPost(null)}>X</button>
            {editingPostId === selectedPost.id ? (
              <div className="edit-post-container">
                <input
                  type="text"
                  value={editingPostTitle}
                  onChange={(e) => setEditingPostTitle(e.target.value)}
                  placeholder="Post title..."
                />
                <textarea
                  value={editingPostBody}
                  onChange={(e) => setEditingPostBody(e.target.value)}
                  placeholder="Post body..."
                />
                <button onClick={() => handleUpdatePost(selectedPost.id)}>Save</button>
                <button onClick={() => { setEditingPostId(null); setEditingPostTitle(''); setEditingPostBody(''); }}>Cancel</button>
              </div>
            ) : (
              <>
                <h3>{selectedPost.title}</h3>
                <p>{selectedPost.body}</p>
                <img
                  src="../../public/—Pngtree—pencil line black icon_3746331.png"
                  alt="Edit Post"
                  onClick={() => startEditingPost(selectedPost)}
                  className="action-icon purple-icon"
                />
              </>
            )}
            <div className="comments-section">
              <h4>Comments</h4>
              <ul>
                {selectedPost.comments && [...selectedPost.comments].sort((a, b) => b.id - a.id).map(comment => (
                  <li key={comment.id} className="comment-item">
                    {editingCommentId === comment.id ? (
                      <>
                        <input
                          type="text"
                          value={editingCommentBody}
                          onChange={(e) => setEditingCommentBody(e.target.value)}
                        />
                        <button onClick={() => handleUpdateComment(comment.id)}>Save</button>
                        <button onClick={() => { setEditingCommentId(null); setEditingCommentBody(''); }}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <strong>{comment.name}</strong> {/* מציג את שם המגיב ככותרת מעל התגובה */}
                        <span>{comment.body}</span>
                        {comment.email === user.email && (
                          <div className="comment-actions">
                            <img
                              src="../../public/—Pngtree—pencil line black icon_3746331.png"
                              alt="Edit"
                              onClick={() => startEditingComment(comment.id, comment.body)}
                              className="action-icon"
                            />
                            <img
                              src="../../public/115789_trash_icon.png"
                              alt="Delete"
                              onClick={() => handleDeleteComment(comment.id)}
                              className="action-icon"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
              {!showAddComment && (
                <button onClick={() => setShowAddComment(true)}>Add Comment</button>
              )}
              {showAddComment && (
                <div className="add-comment-container">
                  <input
                    type="text"
                    value={newCommentBody}
                    onChange={handleNewCommentBodyChange}
                    placeholder="Add a comment..."
                  />
                  <div className="add-comment-buttons">
                    <button onClick={handleAddComment}>Save Comment</button>
                    <button onClick={() => setShowAddComment(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
