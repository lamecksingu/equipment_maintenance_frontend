// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Correct import path

function Home() {
  return (
    <div className="home-container">
      {/* Header with Logo and Buttons */}
      <header className="home-header">
        <div className="home-header-left">
          <img src="/PAlogo.png" alt="Premier Agencies Petroleum Equipment Logo" className="home-logo" />
        </div>
        <div className="home-header-right">
          <Link to="/login" className="home-button">Login</Link>
          <Link to="/register" className="home-button">Register</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="home-main">
	  <section className="intro">
	  <h1 className="home-title">Equipment Maintenance Scheduling System</h1>
	  <p className="home-tagline">Streamline Your Maintenance Process</p>
	  </section>

	  { /* Features section */}
	  <section className="features">
	  <div className="feature-item">
	  <img src="/Technician1.png" alt="Technician Management" />
	  <h3> Technician Management
	  </h3>
	  <p> Manage your technicians and assign tasks seamlessly.
	  </p>
	  </div>

	  <div className="feature-item">
	  <img src="/Pump1.png" alt="Equipment Management" />
	  <h3>Equipment Management
	  </h3>
	  <p>Keep track of your equipment and its maintenance schedule.</p>
	  </div>

	  <div className="feature-item">
	  <img src="/MaintenanceTask.png" alt="Maintenance Task Management" />
	  <h3>Maintenance Task Management</h3>
	  <p>Ensure timely maintenance with a clear task management system.</p>
	  </div>
	  </section>

        {/* About the Project */}
        <section className="home-about">
          <h2>About the Project</h2>
          <p>This system is designed to manage and schedule maintenance tasks for equipment efficiently. It helps track equipment servicing, assign technicians, and ensure smooth operations.</p>
        </section>

        {/* Developer Story */}
        <section className="home-developer-story">
          <h2>About the Developer</h2>
          <p>Hi, I am Lameck Singu, the developer behind this project. I built this application to solve real-world challenges in equipment maintenance. My tech stack includes Node.js for the backend and React.js for the frontend, combined with Express and MySQL for database management.</p>
        </section>

        {/* Call to Action */}
        <footer className="home-footer">
          <div className="home-links">
            <a href="https://your-deployed-app.com" target="_blank" rel="noopener noreferrer" className="home-link">Visit Deployed App</a>
            <a href="https://github.com/lamecksingu/equipment_maintenance_scheduling_system" target="_blank" rel="noopener noreferrer" className="home-link">View on GitHub</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default Home;
