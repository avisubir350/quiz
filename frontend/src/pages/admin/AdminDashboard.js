import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import './Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data.stats)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your quiz application</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">&#128100;</div>
          <div className="stat-info">
            <span className="stat-number">{stats?.totalUsers || 0}</span>
            <span className="stat-name">Total Users</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">&#128218;</div>
          <div className="stat-info">
            <span className="stat-number">{stats?.totalQuizzes || 0}</span>
            <span className="stat-name">Total Quizzes</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">&#9997;</div>
          <div className="stat-info">
            <span className="stat-number">{stats?.totalAttempts || 0}</span>
            <span className="stat-name">Completed Attempts</span>
          </div>
        </div>
      </div>

      <div className="admin-nav-cards">
        <Link to="/admin/quizzes" className="admin-nav-card">
          <h3>&#128218; Manage Quizzes</h3>
          <p>Create, edit, publish and delete quizzes</p>
        </Link>
        <Link to="/admin/users" className="admin-nav-card">
          <h3>&#128100; Manage Users</h3>
          <p>View all registered users and their activity</p>
        </Link>
      </div>
    </div>
  );
}
