import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../styles/AdminDashboard.css'; // We'll add this for custom styles

const AdminDashboard = () => {
        const [users, setUsers] = useState([]);
        const [showUsers, setShowUsers] = useState(false);
        const [errorMessage, setErrorMessage] = useState('');
        const [showCreateForm, setShowCreateForm] = useState(false); // New state to toggle form visibility
        const [newUser, setNewUser] = useState({
                username: '',
                email: '',
                password: '',
                role: '',
                specialization: '',
                experience_level: ''
        });

        // Fetch users
        useEffect(() => {
                if (showUsers) {
                        axios.get('http://localhost:5000/api/users')
                                .then(response => {
                                        setUsers(response.data);
                                })
                                .catch(error => {
                                        console.error('Error fetching users:', error);
                                });
                }
        }, [showUsers]);

        // Toggle display of users
        const toggleUsers = () => {
                setShowUsers(!showUsers);
        };

        // Toggle form visibility for creating user
        const toggleCreateUserForm = () => {
                setShowCreateForm(!showCreateForm); // Toggle the form visibility
                setErrorMessage(''); // Clear error messages when toggling the form
        };

        const handleCreateUser = async (e) => {
                e.preventDefault();

                // Check if the role is selected
                if (newUser.role === '') {
                        setErrorMessage('Please select a role before creating the user.');
                        return;
                }

                // Add other field validation if necessary
                if (!newUser.username || !newUser.password || !newUser.email) {
                        setErrorMessage('Please fill in all required fields.');
                        return;
                }

                // Clear the error message before submission
                setErrorMessage('');

                try {
                        // Make the API request to create the user
                        const response = await axios.post('http://localhost:5000/api/users', newUser);
                        console.log('User created successfully:', response.data);
                        // Optionally reset the form
                        setNewUser({
                                username: '',
                                password: '',
                                email: '',
                                role: '',
                                specialization: '',
                                experience_level: ''
                        });

                        alert('User created successfully!');
                        setShowCreateForm(false); // Hide form after successful creation

                } catch (error) {
                        console.error('Error creating user:', error);
                        setErrorMessage('Error creating user. Please try again.');
                }
        };

        // Handle for editing a user
        const handleEditUser = (id) => {
                console.log('Edit user with ID:', id);
        };

        // Handle for deleting a user
        const handleDeleteUser = (id) => {
                console.log('Delete user with ID:', id);
        };

        return (
                <div className="admin-dashboard">
                        <h2>Admin Dashboard - User Management</h2>

                        <div className="button-group">
                                {/* Button to toggle user display */}
                                <button className="toggle-btn" onClick={toggleUsers}>
                                        <FontAwesomeIcon icon={showUsers ? faEyeSlash : faEye} className="icon" />
                                        {showUsers ? ' Hide Users' : ' Show Users'}
                                </button>

                                {/* Button to toggle the Create User form */}
                                <button onClick={toggleCreateUserForm} className="create-user-btn">
                                        <FontAwesomeIcon icon={faPlus} /> {showCreateForm ? 'Cancel' : 'Create User'}
                                </button>
                        </div>

                        {/* Form to create a new user */}
                        {showCreateForm && (
                                <form onSubmit={handleCreateUser} className="create-user-form">
                                        {errorMessage && (
                                                <div className="error-message" style={{ color: 'red' }}>
                                                        {errorMessage}
                                                </div>
                                        )}
                                        <input
                                                type="text"
                                                placeholder="Username"
                                                value={newUser.username}
                                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                        />
                                        <input
                                                type="email"
                                                placeholder="Email"
                                                value={newUser.email}
                                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        />
                                        <input
                                                type="password"
                                                placeholder="Password"
                                                value={newUser.password}
                                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                        />
                                        <select
                                                value={newUser.role}
                                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                        >
                                                <option value="">Select Role</option>
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                                <option value="technician">Technician</option>
                                        </select>

                                        {/* Conditional fields for Technician role */}
                                        {newUser.role === 'technician' && (
                                                <>
                                                        <input
                                                                type="text"
                                                                placeholder="Specialization"
                                                                value={newUser.specialization}
                                                                onChange={(e) =>
                                                                        setNewUser({ ...newUser, specialization: e.target.value })
                                                                }
                                                        />
                                                        <input
                                                                type="text"
                                                                placeholder="Experience Level"
                                                                value={newUser.experience_level}
                                                                onChange={(e) =>
                                                                        setNewUser({ ...newUser, experience_level: e.target.value })
                                                                }
                                                        />
                                                </>
                                        )}
                                        <button type="submit">Submit</button>
                                </form>
                        )}

                        {/* Table of users */}
                        {showUsers && (
                                <table className="user-table">
                                        <thead>
                                                <tr>
                                                        <th>ID</th>
                                                        <th>Username</th>
                                                        <th>Email</th>
                                                        <th>Role</th>
                                                        <th>Actions</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                {users.map(user => (
                                                        <tr key={user.id}>
                                                                <td>{user.id}</td>
                                                                <td>{user.username}</td>
                                                                <td>{user.email}</td>
                                                                <td>{user.role}</td>
                                                                <td>
                                                                        {/* Edit button */}
                                                                        <button onClick={() => handleEditUser(user.id)} className="edit-btn">
                                                                                <FontAwesomeIcon icon={faEdit} /> Edit
                                                                        </button>

                                                                        {/* Delete button */}
                                                                        <button onClick={() => handleDeleteUser(user.id)} className="delete-btn">
                                                                                <FontAwesomeIcon icon={faTrashAlt} /> Delete
                                                                        </button>
                                                                </td>
                                                        </tr>
                                                ))}
                                        </tbody>
                                </table>
                        )}
                </div>
        );
};

export default AdminDashboard;
