// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode for decoding tokens
import '../styles/Login.css'; // A CSS file for created for styling

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      // localStorage.setItem('token', response.data.token);
	    
	    const token = response.data.token;

	    // Decode the token to get the role
	    const decodeToken = jwtDecode(token);
	    const role = decodeToken.role;

	    // store the role in local storage
	    localStorage.setItem('userRole', role);

	    // store the token in localStorage
	    localStorage.setItem('userRole', role);

     //  navigate('/dashboard'); // Redirect to dashboard after successful login

	    // redirect to dashboard based on role
	    if (role === 'admin') {
		    navigate('/admin-dashboard');
	    } else if (role === 'technician') {
		    navigate('/technician-dashboard');
	    } else if (role === 'user') {
		    navigate('/user-dashboard');
	    } else {
		    navigate('/login');
	    }
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleLogin}>Login</button>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
};

export default Login;
