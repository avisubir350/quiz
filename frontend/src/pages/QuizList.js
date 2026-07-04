import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './QuizList.css';

const DIFFICULTY_COLORS = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/quizzes').then(r => {
      setQuizzes(r.data.quizzes);
      setFiltered(r.data.quizzes);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = quizzes;
    if (search) result = result.filter(q => q.title.toLowerCase().includes(search.toLowerCase()) || q.category?.toLowerCase().includes(search.toLowerCase()));
    if (difficulty !== 'all') result = result.filter(q => q.difficulty === difficulty);
    setFiltered(result);
  }, [search, difficulty, quizzes]);

  if (loading) return <div className="loading">Loading quizzes...</div>;

  return (
    <div className="quiz-list-page">
      <div className="quiz-list-header">
        <h1>All Quizzes</h1>
        <p>{filtered.length} quiz{filtered.length !== 1 ? 'zes' : ''} available</p>
      </div>

      <div className="quiz-filters">
        <input
          type="search" placeholder="Search quizzes..." value={search}
          onChange={e => setSearch(e.target.value)} className="search-input" aria-label="Search quizzes"
        />
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)} aria-label="Filter by difficulty">
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="no-results">No quizzes found. Try a different search.</div>
      ) : (
        <div className="quiz-grid">
          {filtered.map(quiz => (
            <Link to={`/quizzes/${quiz.id}`} key={quiz.id} className="quiz-card">
              <div className="quiz-card-header">
                <span className="quiz-category">{quiz.category || 'General'}</span>
                <span className="quiz-difficulty" style={{ color: DIFFICULTY_COLORS[quiz.difficulty] }}>
                  {quiz.difficulty}
                </span>
              </div>
              <h3>{quiz.title}</h3>
              <p>{quiz.description || 'Test your knowledge with this quiz.'}</p>
              <div className="quiz-card-footer">
                {quiz.timeLimit && <span>&#9201; {quiz.timeLimit} min</span>}
                <span>&#127942; Pass: {quiz.passingScore}%</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
