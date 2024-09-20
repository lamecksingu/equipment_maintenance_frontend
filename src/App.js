import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwtDecode

function App() {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    // Function to decode the JWT token and extract role
    const getUserRoleFromToken = () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn("No token found in localStorage.");
                return null;
            }

            const decodedToken = jwtDecode(token);
            console.log("Decoded Token:", decodedToken);

            const role = decodedToken.role;
            if (role && typeof role === 'string') {
                console.log("Extracted Role:", role);
                return role.toLowerCase(); // Ensure the role is lowercased
            } else {
                console.warn("Invalid or missing role in token.");
                return null;
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            return null; // Return null if there's an error
        }
    };

    useEffect(() => {
        // Check if role is stored in local storage
        const storedRole = localStorage.getItem('userRole'); // Get role from local storage
        if (storedRole) {
            // If role is present in local storage, set it and stop loading
            setUserRole(storedRole.toLowerCase());
            setLoading(false); // Stop loading after role is fetched
        } else {
            // If no role in local storage, try to get it from the token
            const tokenRole = getUserRoleFromToken();
            if (tokenRole) {
                setUserRole(tokenRole);
                localStorage.setItem('userRole', tokenRole); // Sync role with local storage
            } else {
                localStorage.removeItem('userRole'); // Clear any stale role data
            }
            setLoading(false); // Stop loading after role check
        }
    }, []); // Empty dependency array to run once on mount

    useEffect(() => {
        console.log("User Role State:", userRole); // Log user role state changes for debugging
    }, [userRole]);

    // If still loading, show a loading spinner or placeholder
    if (loading) {
        return <div>Loading...</div>; // Placeholder while loading
    }

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Conditional rendering for dashboard routes based on user role */}
                    <Route path="/admin-dashboard" element={
                        userRole === 'admin' ? <AdminDashboard /> :
                        <Navigate to="/login" />
                    } />
                    <Route path="/technician-dashboard" element={
                        userRole === 'technician' ? <TechnicianDashboard /> :
                        <Navigate to="/login" />
                    } />
                    <Route path="/user-dashboard" element={
                        userRole === 'user' ? <UserDashboard /> :
                        <Navigate to="/login" />
                    } />

                    {/* Default redirect for any unmatched routes */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
