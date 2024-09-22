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
	const [showEditForm, setShowEditForm] = useState(false); // Toggle for edit user form
    const [editUser, setEditUser] = useState(null); // State to hold the user being edited
//	const [selectedUser, setSelectedUser] = useState(null); // State to hold the user being edited

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

	// Define the fetchUsers function
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users');
            setUsers(response.data); // Update the state with the fetched users
        } catch (error) {
            console.error("Error fetching users:", error);
            setErrorMessage('Error fetching users. Please try again.');
        }
    };

    // Use fetchUsers when the component loads
    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle when the Edit button is clicked for a user
const handleEditUser = (user) => {
	console.log("user id: ", user); // verify the correct data is passed
    setEditUser(user); // Set the selected user for editing
    setShowEditForm(true); // Show the edit form

    // Populate the form with the user's current data
    setNewUser({
	id: user.id,
        username: user.username,
        email: user.email,
        password: '', // You may want to keep this empty for security reasons
        role: user.role,
        specialization: user.specialization || '', // Optional fields for technician role
        experience_level: user.experience_level || ''
    });
};

    // Handle changes to form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    // Function to update user data
    const handleUpdateUser = async (e) => {
        e.preventDefault();

        if (!editUser) {
            alert('No user selected for editing.');
            return;
        }

        const userId = editUser.id;
	    // build the updatedData object conditionally
        const updatedData = {
            username: newUser.username,
            email: newUser.email,
            password: newUser.password,
            role: newUser.role,
	};

	    // Only add technician-specific fields if the role is technician
	    if (newUser.role === 'technician') {
		    updatedData.specialization = newUser.specialization;
		    updatedData.experience_level = newUser.experience_level
        }

        try {
            const response = await axios.put(`http://localhost:5000/api/users/${userId}`, updatedData);
            console.log('User updated successfully:', response.data);
            alert('User updated successfully!');
            setShowEditForm(false); // Hide the edit form
            fetchUsers(); // Refresh the list of users
        } catch (error) {
            console.error('Error updating user:', error);
            setErrorMessage('Error updating user. Please try again.');
        }
    };


	// Handle for deleting a user
const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?'); // Ask for confirmation
    if (!confirmDelete) return; // If the user clicks 'Cancel', stop here

    try {
        // Make the DELETE request to remove the user
        await axios.delete(`http://localhost:5000/api/users/${id}`);

        // Remove the deleted user from the state
        setUsers(users.filter(user => user.id !== id));

        alert('User deleted successfully!');
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
    }
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

	    {/* Edit Form */}
{showEditForm && (
    <div className="edit-form">
        <h2>Edit User</h2>
        <form onSubmit={handleUpdateUser}>
            <label>
                Username:
                <input
                    type="text"
                    name="username"
                    value={newUser.username}
                    onChange={handleInputChange}
                    required
                />
            </label>
            <label>
                Email:
                <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    required
                />
            </label>
            <label>
                Password:
                <input
                    type="password"
                    name="password"
                    value={newUser.password} // Empty by default
                    onChange={handleInputChange}
                />
            </label>
            <label>
                Role:
                <select
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="technician">Technician</option>
                    <option value="user">User</option>
                </select>
            </label>

            {/* Display technician-specific fields if role is 'technician' */}
            {newUser.role === 'technician' && (
                <>
                    <label>
                        Specialization:
                        <input
                            type="text"
                            name="specialization"
                            value={newUser.specialization}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Experience Level:
                        <input
                            type="text"
                            name="experience_level"
                            value={newUser.experience_level}
                            onChange={handleInputChange}
                        />
                    </label>
                </>
            )}
            <button type="submit">Update User</button>
        </form>
    </div>
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
                                    <button onClick={() => handleEditUser(user)} className="edit-btn">
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
