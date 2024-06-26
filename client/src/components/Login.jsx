// Import necessary libraries and hooks from React and React Router
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css'; // Import the CSS file for styling

// Define the Login component
const Login = () => {
  // State variables to hold the username and password input values, and any error messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Hook to programmatically navigate the user to a different route
  const navigate = useNavigate();

  // Function to handle the login form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Clear any previous error messages
    setUsernameError('');
    setPasswordError('');

    try {
      // Fetch the list of users from the server
      const response = await fetch('http://localhost:3000/users');
      if (!response.ok) throw new Error('Failed to fetch users'); // If the response is not ok, throw an error
      const users = await response.json(); // Parse the response JSON

      // Find the user with the matching username
      const user = users.find((u) => u.username === username);

      // Check if the user exists and if the password matches
      if (!user) {
        setUsernameError('Username not found'); // If user is not found, set the username error
      } else if (user.website !== password) { // Here, the 'website' field is used as the password
        setPasswordError('Incorrect password'); // If password is incorrect, set the password error
      } else {
        // Save the user information in local storage and navigate to the home page
        localStorage.setItem('user', JSON.stringify(user)); // Save the user data in localStorage
        navigate('/home'); // Navigate to the home page
      }
    } catch (error) {
      // Log any errors that occur during the login process
      console.error('Error during login:', error);
    }
  };

  return (
    // Render the login form
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update the username state when the input value changes
        />
        {/* Display an error message if the username is not found */}
        {usernameError && <div className="error">{usernameError}</div>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update the password state when the input value changes
        />
        {/* Display an error message if the password is incorrect */}
        {passwordError && <div className="error">{passwordError}</div>}
        <button type="submit">Login</button> {/* Button to submit the form */}
      </form>
      <a href="/register">Don't have an account? Register</a> {/* Link to the registration page */}
    </div>
  );
};

// Export the Login component as the default export
export default Login;
