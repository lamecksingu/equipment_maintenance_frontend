import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/maintenance_tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            Equipment ID: {task.equipment_id}, Technician ID: {task.technician_id}, Scheduled Date: {task.scheduled_date}, Status: {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
