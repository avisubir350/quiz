import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import './QuizResult.css';

export default function QuizResult() {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/attempts/${attemptId}`).then(r => setAttempt(r.data.attempt))
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) return <div className="loading">Loading results...</div>;
  if (!attempt) return <div className="loading">Result not found.</div>;

  const { score, passed, earnedPoints, totalPoints, timeTaken, quiz, answers } = attempt;
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  return (
    <div className="result-page">
      <div className="result-card">
        <div className={`result-badge ${passed ? 'pass' : 'fail'}`}>
          {passed ? '🎉 Passed!' : '😔 Not Passed'}
        </div>
        <h1>{quiz?.title}</h1>

        <div className="score-circle">
          <svg viewBox="0 0 120 120" aria-label={`Score: ${score}%`}>
            <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="10" />
            <circle cx="60" cy="60" r="50" fill="none"
              stroke={passed ? '#10b981' : '#ef4444'} strokeWidth="10"
              strokeDasharray={`${(score / 100) * 314} 314`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)" />
          </svg>
          <div className="score-text">
            <span className="score-number">{score}%</span>
            <span className="score-label">Score</span>
          </div>
        </div>

        <div className="result-stats">
          <div className="stat">
            <span className="stat-value">{earnedPoints}/{totalPoints}</span>
            <span className="stat-label">Points</span>
          </div>
          <div className="stat">
            <span className="stat-value">{answers?.filter(a => a.isCorrect).length || 0}/{answers?.length || 0}</span>
            <span className="stat-label">Correct</span>
          </div>
          <div className="stat">
            <span className="stat-value">{minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`}</span>
            <span className="stat-label">Time Taken</span>
          </div>
        </div>

        {answers && answers.length > 0 && (
          <div className="answers-review">
            <h3>Review Answers</h3>
            {answers.map((answer, i) => (
              <div key={answer.id} className={`answer-item ${answer.isCorrect ? 'correct' : 'wrong'}`}>
                <div className="answer-icon">{answer.isCorrect ? '✓' : '✗'}</div>
                <div className="answer-content">
                  <p className="answer-question"><strong>Q{i + 1}:</strong> {answer.question?.text}</p>
                  <p className="answer-selected">
                    Your answer: <em>{answer.selectedOption?.text || 'Not answered'}</em>
                  </p>
                  {answer.question?.explanation && !answer.isCorrect && (
                    <p className="answer-explanation">💡 {answer.question.explanation}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="result-actions">
          <Link to="/quizzes" className="btn-primary">Browse More Quizzes</Link>
          <Link to="/history" className="btn-secondary-sm">View History</Link>
        </div>
      </div>
    </div>
  );
}
