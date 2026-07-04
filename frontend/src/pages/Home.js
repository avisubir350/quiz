import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Test Your Knowledge</h1>
          <p>Challenge yourself with quizzes on programming, geography, science, and more. Track your progress and improve your skills.</p>
          <div className="hero-actions">
            <Link to="/quizzes" className="btn-primary">Browse Quizzes</Link>
            {!user && <Link to="/register" className="btn-secondary">Get Started Free</Link>}
          </div>
        </div>
        <div className="hero-graphic" aria-hidden="true">
          <div className="graphic-circle">?</div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">&#128218;</div>
          <h3>Multiple Categories</h3>
          <p>Quizzes across programming, geography, science, history, and more.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">&#9201;</div>
          <h3>Timed Challenges</h3>
          <p>Optional time limits to make the experience more engaging.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">&#128200;</div>
          <h3>Track Progress</h3>
          <p>View your quiz history and see how you improve over time.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">&#127942;</div>
          <h3>Instant Results</h3>
          <p>Get your score immediately with explanations for each answer.</p>
        </div>
      </section>
    </div>
  );
}
