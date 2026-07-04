import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import QuizList from './pages/QuizList';
import QuizDetail from './pages/QuizDetail';
import TakeQuiz from './pages/TakeQuiz';
import QuizResult from './pages/QuizResult';
import History from './pages/History';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminQuizzes from './pages/admin/AdminQuizzes';
import AdminQuizEditor from './pages/admin/AdminQuizEditor';
import AdminUsers from './pages/admin/AdminUsers';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quizzes" element={<QuizList />} />
        <Route path="/quizzes/:id" element={<QuizDetail />} />
        <Route path="/quizzes/:id/take" element={<PrivateRoute><TakeQuiz /></PrivateRoute>} />
        <Route path="/result/:attemptId" element={<PrivateRoute><QuizResult /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/quizzes" element={<AdminRoute><AdminQuizzes /></AdminRoute>} />
        <Route path="/admin/quizzes/:id/edit" element={<AdminRoute><AdminQuizEditor /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
