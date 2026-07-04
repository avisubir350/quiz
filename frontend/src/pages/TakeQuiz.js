import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import './TakeQuiz.css';

export default function TakeQuiz() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(state?.quiz || null);
  const [attemptId] = useState(state?.attemptId);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(!state?.quiz);

  useEffect(() => {
    if (!state?.attemptId) { navigate(`/quizzes/${id}`); return; }
    if (!quiz) {
      api.get(`/quizzes/${id}`).then(r => {
        setQuiz(r.data.quiz);
        if (r.data.quiz.timeLimit) setTimeLeft(r.data.quiz.timeLimit * 60);
      }).finally(() => setLoading(false));
    } else {
      if (quiz.timeLimit) setTimeLeft(quiz.timeLimit * 60);
      setLoading(false);
    }
  }, [id, quiz, state, navigate]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const answersArray = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
        questionId: parseInt(questionId),
        selectedOptionId
      }));
      await api.post(`/attempts/${attemptId}/submit`, { answers: answersArray });
      navigate(`/result/${attemptId}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
      setSubmitting(false);
    }
  }, [answers, attemptId, navigate, submitting]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleSubmit]);

  const formatTime = s => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  if (loading) return <div className="loading">Loading quiz...</div>;
  if (!quiz) return null;

  const questions = quiz.questions || [];
  const question = questions[current];
  const progress = ((current + 1) / questions.length) * 100;
  const answered = Object.keys(answers).length;

  return (
    <div className="take-quiz-page">
      <div className="quiz-header-bar">
        <div className="quiz-progress-info">
          <span className="quiz-title-small">{quiz.title}</span>
          <span>{current + 1} / {questions.length}</span>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        {timeLeft !== null && (
          <div className={`timer ${timeLeft < 60 ? 'urgent' : ''}`} aria-live="polite">
            &#9201; {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div className="question-card">
        <div className="question-number">Question {current + 1}</div>
        <h2 className="question-text">{question.text}</h2>
        <div className="options-list" role="radiogroup" aria-label={`Options for question ${current + 1}`}>
          {question.options.map(option => (
            <label key={option.id} className={`option-label ${answers[question.id] === option.id ? 'selected' : ''}`}>
              <input
                type="radio"
                name={`q${question.id}`}
                value={option.id}
                checked={answers[question.id] === option.id}
                onChange={() => setAnswers({ ...answers, [question.id]: option.id })}
              />
              <span>{option.text}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="quiz-navigation">
        <button className="btn-nav" onClick={() => setCurrent(c => c - 1)} disabled={current === 0}>
          ← Previous
        </button>
        <span className="answered-count">{answered} of {questions.length} answered</span>
        {current < questions.length - 1 ? (
          <button className="btn-nav btn-next" onClick={() => setCurrent(c => c + 1)}>
            Next →
          </button>
        ) : (
          <button className="btn-submit-quiz" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </div>

      <div className="question-dots" aria-label="Question navigation">
        {questions.map((q, i) => (
          <button key={i} className={`dot ${i === current ? 'active' : ''} ${answers[q.id] ? 'answered' : ''}`}
            onClick={() => setCurrent(i)} aria-label={`Go to question ${i + 1}`}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
