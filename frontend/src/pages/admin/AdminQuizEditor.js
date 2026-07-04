import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import './Admin.css';
import './QuizEditor.css';

const EMPTY_OPTION = { text: '', isCorrect: false };
const EMPTY_QUESTION = { text: '', type: 'single', points: 1, explanation: '', options: [{ ...EMPTY_OPTION }, { ...EMPTY_OPTION }, { ...EMPTY_OPTION }, { ...EMPTY_OPTION }] };

export default function AdminQuizEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [form, setForm] = useState(EMPTY_QUESTION);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const r = await api.get(`/admin/quizzes`);
    const q = r.data.quizzes.find(qz => qz.id === parseInt(id));
    if (!q) { navigate('/admin/quizzes'); return; }
    setQuiz(q);
    const r2 = await api.get(`/quizzes/${id}`);
    setQuestions(r2.data.quiz?.questions || []);
  };

  useEffect(() => { load().finally(() => setLoading(false)); }, [id]);

  const openAdd = () => { setEditingQuestion(null); setForm({ ...EMPTY_QUESTION, options: Array(4).fill(null).map(() => ({ ...EMPTY_OPTION })) }); setShowModal(true); };
  const openEdit = (q) => {
    setEditingQuestion(q);
    setForm({ text: q.text, type: q.type, points: q.points, explanation: q.explanation || '', options: q.options.map(o => ({ text: o.text, isCorrect: o.isCorrect })) });
    setShowModal(true);
  };

  const handleOptionChange = (i, field, value) => {
    const opts = [...form.options];
    if (field === 'isCorrect' && form.type === 'single') {
      opts.forEach((o, idx) => { opts[idx] = { ...opts[idx], isCorrect: idx === i }; });
    } else {
      opts[i] = { ...opts[i], [field]: value };
    }
    setForm({ ...form, options: opts });
  };

  const addOption = () => setForm({ ...form, options: [...form.options, { ...EMPTY_OPTION }] });
  const removeOption = (i) => { if (form.options.length <= 2) return; setForm({ ...form, options: form.options.filter((_, idx) => idx !== i) }); };

  const handleTypeChange = (type) => {
    if (type === 'true_false') {
      setForm({ ...form, type, options: [{ text: 'True', isCorrect: true }, { text: 'False', isCorrect: false }] });
    } else {
      setForm({ ...form, type });
    }
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingQuestion) {
        await api.put(`/admin/questions/${editingQuestion.id}`, form);
      } else {
        await api.post(`/admin/quizzes/${id}/questions`, form);
      }
      await load();
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (qId) => {
    if (!window.confirm('Delete this question?')) return;
    await api.delete(`/admin/questions/${qId}`);
    await load();
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-page">
      <div className="admin-top-bar">
        <div>
          <button onClick={() => navigate('/admin/quizzes')} className="btn-back-link">← Back to Quizzes</button>
          <h1>{quiz?.title}</h1>
          <p style={{ color: '#64748b' }}>{questions.length} questions · {quiz?.isPublished ? '✓ Published' : 'Draft'}</p>
        </div>
        <button className="btn-add" onClick={openAdd}>+ Add Question</button>
      </div>

      <div className="questions-list">
        {questions.length === 0 && (
          <div className="empty-questions">
            <p>No questions yet. Add your first question!</p>
            <button className="btn-add" onClick={openAdd}>+ Add Question</button>
          </div>
        )}
        {questions.map((q, i) => (
          <div key={q.id} className="question-editor-card">
            <div className="qe-header">
              <span className="qe-number">Q{i + 1}</span>
              <span className="badge draft">{q.type}</span>
              <span className="badge published">{q.points} pt{q.points > 1 ? 's' : ''}</span>
              <div className="qe-actions">
                <button className="btn-sm edit" onClick={() => openEdit(q)}>Edit</button>
                <button className="btn-sm delete" onClick={() => handleDelete(q.id)}>Delete</button>
              </div>
            </div>
            <p className="qe-text">{q.text}</p>
            <div className="qe-options">
              {q.options.map(opt => (
                <span key={opt.id} className={`qe-option ${opt.isCorrect ? 'correct' : ''}`}>
                  {opt.isCorrect ? '✓ ' : ''}{opt.text}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editingQuestion ? 'Edit Question' : 'Add Question'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Question Type</label>
                <select value={form.type} onChange={e => handleTypeChange(e.target.value)}>
                  <option value="single">Single Choice</option>
                  <option value="multiple">Multiple Choice</option>
                  <option value="true_false">True / False</option>
                </select>
              </div>
              <div className="form-group">
                <label>Question Text *</label>
                <textarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} required placeholder="Enter your question..." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Points</label>
                  <input type="number" value={form.points} onChange={e => setForm({ ...form, points: Number(e.target.value) })} min="1" />
                </div>
              </div>
              <div className="form-group">
                <label>Answer Options {form.type === 'single' ? '(click to mark correct)' : '(check all correct)'}</label>
                {form.options.map((opt, i) => (
                  <div key={i} className="option-editor-row">
                    <input type={form.type === 'multiple' ? 'checkbox' : 'radio'}
                      name="correctOption"
                      checked={opt.isCorrect}
                      onChange={() => handleOptionChange(i, 'isCorrect', !opt.isCorrect)}
                      style={{ accentColor: '#4f46e5' }}
                    />
                    <input type="text" value={opt.text} onChange={e => handleOptionChange(i, 'text', e.target.value)}
                      placeholder={`Option ${i + 1}`} required={i < 2} disabled={form.type === 'true_false'}
                    />
                    {form.type !== 'true_false' && (
                      <button type="button" onClick={() => removeOption(i)} className="btn-remove-opt" title="Remove option" disabled={form.options.length <= 2}>✕</button>
                    )}
                  </div>
                ))}
                {form.type !== 'true_false' && (
                  <button type="button" onClick={addOption} className="btn-add-opt">+ Add Option</button>
                )}
              </div>
              <div className="form-group">
                <label>Explanation (shown after answering)</label>
                <textarea value={form.explanation} onChange={e => setForm({ ...form, explanation: e.target.value })} placeholder="Optional explanation..." />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={saving}>{saving ? 'Saving...' : 'Save Question'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
