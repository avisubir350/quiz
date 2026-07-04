import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import './QuizDetail.css';

export default function QuizDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    api.get(`/quizzes/${id}`).then(r => setQuiz(r.data.quiz))
      .catch(() => navigate('/quizzes'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleStart = async () => {
    if (!user) return navigate('/login');
    setStarting(true);
    try {
      const { data } = await api.post(`/attempts/quiz/${id}/start`);
      navigate(`/quizzes/${id}/take`, { state: { attemptId: data.attempt.id, quiz } });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start quiz');
    } finally {
      setStarting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!quiz) return null;

  return (
    <div className="quiz-detail-page">
      <div className="quiz-detail-card">
        <div className="quiz-detail-meta">
          <span className="tag">{quiz.category || 'General'}</span>
          <span className="tag difficulty">{quiz.difficulty}</span>
        </div>
        <h1>{quiz.title}</h1>
        <p className="quiz-description">{quiz.description}</p>

        <div className="quiz-info-grid">
          <div className="info-item">
            <span className="info-label">Questions</span>
            <span className="info-value">{quiz.questions?.length || 0}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Time Limit</span>
            <span className="info-value">{quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Passing Score</span>
            <span className="info-value">{quiz.passingScore}%</span>
          </div>
          <div className="info-item">
            <span className="info-label">Created by</span>
            <span className="info-value">{quiz.creator?.username || 'Admin'}</span>
          </div>
        </div>

        <div className="quiz-actions">
          <button className="btn-start" onClick={handleStart} disabled={starting}>
            {starting ? 'Starting...' : user ? 'Start Quiz' : 'Login to Start'}
          </button>
          <Link to="/quizzes" className="btn-back">← Back to Quizzes</Link>
        </div>
      </div>
    </div>
  );
}
