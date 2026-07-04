import React, { useEffect, useState } from 'react';
import api from '../../api';
import './Admin.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/users').then(r => setUsers(r.data.users)).finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="admin-page">
      <div className="admin-top-bar">
        <div>
          <h1>Users</h1>
          <p style={{ color: '#64748b' }}>{users.length} registered users</p>
        </div>
        <input
          type="search" placeholder="Search users..." value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '0.65rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}
          aria-label="Search users"
        />
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id}>
                <td>#{user.id}</td>
                <td><strong>{user.username}</strong></td>
                <td>{user.email}</td>
                <td><span className={`badge ${user.role}`}>{user.role}</span></td>
                <td><span className={`badge ${user.isActive ? 'active' : 'inactive'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No users found.</p>}
      </div>
    </div>
  );
}
