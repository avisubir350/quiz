import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/quizzes');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account</p>
        {error && <div className="auth-error" role="alert">{error}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="you@example.com" required autoComplete="email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" value={form.password}
              onChange={handleChange} placeholder="••••••••" required autoComplete="current-password" />
          </div>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <div className="demo-creds">
          <p><strong>Demo Admin:</strong> admin@quiz.com / admin123</p>
          <p><strong>Demo User:</strong> john@quiz.com / user123</p>
        </div>
      </div>
    </div>
  );
}
