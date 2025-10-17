import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp, ACTIONS } from '../context/AppContext';
import { getProfile } from '../services/api';

const PrivateRoute = ({ children }) => {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verifica se o token é válido buscando o perfil do usuário
        const user = await getProfile();
        dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: { token } });
        dispatch({ type: ACTIONS.SET_USER, payload: user });
      } catch (error) {
        // Token inválido, remove do localStorage
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    if (!state.isAuthenticated) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [state.isAuthenticated, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

