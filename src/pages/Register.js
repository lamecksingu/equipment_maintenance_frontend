// src/pages/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css'; // A CSS file created for styling

const Register = () => {
  const [username, setUsername] = useState(''); // New state for username
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(''); // New state for role
  const [specialization, setSpecialization] = useState(''); // For technician
  const [experienceLevel, setExperienceLevel] = useState(''); // For technician
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const requestData = { username, email, password, role };
      if (role === 'technician') {
	      requestData.specialization = specialization;
	      requestData.experience_level = experienceLevel;
      }
      await axios.post('http://localhost:5000/api/auth/register', requestData);
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <input
	  type="text"
	  placeholder="Username"
	  value={username}
	  onChange={(e) => setUsername(e.target.value)}
	  />
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
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
	  <select
	  value={role}
	  onChange={(e) => setRole(e.target.value)}
	  >
	  <option value="">Select Role</option>
	  <option value="user">User</option>
	  <option value="admin">Admin</option>
	  <option value="technician">Technician</option>
	  </select>

	  {/* Show additional fields if the role is "technician" */}
		  {role === 'technician' && (
			  <>
			  <input
			  type="text"
			  placeholder="Specialization"
			  value={specialization}
			  onChange={(e) => setSpecialization(e.target.value)}
			  />
			  <input
			  type="text"
			  placeholder="Experience Level"
			  value={experienceLevel}
			  onChange={(e) => setExperienceLevel(e.target.value)}
			  />
			  </>
		  )}
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleRegister}>Register</button>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default Register
