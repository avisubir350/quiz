import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './History.css';

export default function History() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/quizzes/history').then(r => setAttempts(r.data.attempts))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading history...</div>;

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>My Quiz History</h1>
        <p>{attempts.length} attempt{attempts.length !== 1 ? 's' : ''} completed</p>
      </div>

      {attempts.length === 0 ? (
        <div className="empty-state">
          <p>You haven't taken any quizzes yet.</p>
          <Link to="/quizzes" className="btn-primary-sm">Browse Quizzes</Link>
        </div>
      ) : (
        <div className="history-list">
          {attempts.map(attempt => (
            <Link to={`/result/${attempt.id}`} key={attempt.id} className="history-card">
              <div className="history-card-left">
                <h3>{attempt.quiz?.title}</h3>
                <div className="history-meta">
                  <span className="tag-sm">{attempt.quiz?.category}</span>
                  <span className="tag-sm difficulty">{attempt.quiz?.difficulty}</span>
                </div>
                <p className="history-date">
                  {attempt.completedAt
                    ? new Date(attempt.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : 'In progress'}
                </p>
              </div>
              <div className="history-card-right">
                {attempt.completedAt ? (
                  <>
                    <div className={`score-badge ${attempt.passed ? 'pass' : 'fail'}`}>
                      {attempt.score}%
                    </div>
                    <span className={`status-label ${attempt.passed ? 'pass' : 'fail'}`}>
                      {attempt.passed ? 'Passed' : 'Failed'}
                    </span>
                  </>
                ) : (
                  <span className="status-label ongoing">In Progress</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
