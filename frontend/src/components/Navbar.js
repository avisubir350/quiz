import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">&#9670; QuizApp</Link>
      </div>
      <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        &#9776;
      </button>
      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/quizzes" onClick={() => setMenuOpen(false)}>Quizzes</Link>
        {user && <Link to="/history" onClick={() => setMenuOpen(false)}>My History</Link>}
        {user?.role === 'admin' && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
        {user ? (
          <div className="navbar-user">
            <span className="user-name">Hi, {user.username}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="navbar-auth">
            <Link to="/login" className="btn-login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" className="btn-register" onClick={() => setMenuOpen(false)}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
