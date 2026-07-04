import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import './Admin.css';

const EMPTY_QUIZ = { title: '', description: '', category: '', difficulty: 'medium', timeLimit: '', passingScore: 60 };

export default function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_QUIZ);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/admin/quizzes').then(r => setQuizzes(r.data.quizzes));

  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/admin/quizzes', { ...form, timeLimit: form.timeLimit ? Number(form.timeLimit) : null, passingScore: Number(form.passingScore) });
      await load();
      setShowModal(false);
      setForm(EMPTY_QUIZ);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save quiz');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this quiz? This will also remove all questions and attempts.')) return;
    await api.delete(`/admin/quizzes/${id}`);
    await load();
  };

  const handleTogglePublish = async (quiz) => {
    await api.patch(`/admin/quizzes/${quiz.id}/publish`);
    await load();
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-page">
      <div className="admin-top-bar">
        <div>
          <h1>Quizzes</h1>
          <p style={{ color: '#64748b' }}>{quizzes.length} total quizzes</p>
        </div>
        <button className="btn-add" onClick={() => setShowModal(true)}>+ New Quiz</button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map(quiz => (
              <tr key={quiz.id}>
                <td><strong>{quiz.title}</strong></td>
                <td>{quiz.category || '—'}</td>
                <td style={{ textTransform: 'capitalize' }}>{quiz.difficulty}</td>
                <td>
                  <span className={`badge ${quiz.isPublished ? 'published' : 'draft'}`}>
                    {quiz.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>{quiz.creator?.username}</td>
                <td>
                  <div className="actions-cell">
                    <Link to={`/admin/quizzes/${quiz.id}/edit`} className="btn-sm edit">Edit Questions</Link>
                    <button className={`btn-sm ${quiz.isPublished ? 'unpublish' : 'publish'}`} onClick={() => handleTogglePublish(quiz)}>
                      {quiz.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button className="btn-sm delete" onClick={() => handleDelete(quiz.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Create New Quiz</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. JavaScript Basics" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Brief quiz description..." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Programming" />
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select name="difficulty" value={form.difficulty} onChange={handleChange}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Time Limit (minutes)</label>
                  <input type="number" name="timeLimit" value={form.timeLimit} onChange={handleChange} placeholder="Leave blank for no limit" min="1" />
                </div>
                <div className="form-group">
                  <label>Passing Score (%)</label>
                  <input type="number" name="passingScore" value={form.passingScore} onChange={handleChange} min="0" max="100" />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={saving}>{saving ? 'Saving...' : 'Create Quiz'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
