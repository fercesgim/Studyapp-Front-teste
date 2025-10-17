import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import StudyPlan from './pages/StudyPlan';
import Quiz from './pages/Quiz';
import './App.css';
import './services/axiosInterceptor'; // Importa o interceptor

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rotas privadas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Navigate to="/dashboard" replace />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <Layout>
                  <Upload />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/study-plan"
            element={
              <PrivateRoute>
                <Layout>
                  <StudyPlan />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/study-plan/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <StudyPlan />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/quiz/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <Quiz />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;

