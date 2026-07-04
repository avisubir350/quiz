import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate('/quizzes');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create account</h2>
        <p className="auth-subtitle">Join and start taking quizzes</p>
        {error && <div className="auth-error" role="alert">{error}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" name="username" value={form.username}
              onChange={handleChange} placeholder="johndoe" required minLength={3} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" value={form.password}
              onChange={handleChange} placeholder="Min 6 characters" required minLength={6} />
          </div>
          <div className="form-group">
            <label htmlFor="confirm">Confirm Password</label>
            <input id="confirm" type="password" name="confirm" value={form.confirm}
              onChange={handleChange} placeholder="Repeat password" required />
          </div>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
