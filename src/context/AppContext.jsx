import React, { createContext, useContext, useReducer } from 'react';

// Estado inicial
const initialState = {
  studyPlans: [],
  currentStudyPlan: null,
  quizzes: [],
  currentQuiz: null,
  quizResults: [],
  sessionId: null,
  loading: false,
  error: null,
  // Autenticação
  isAuthenticated: false,
  user: null,
  token: null,
};

// Tipos de ações
export const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_STUDY_PLAN: 'SET_STUDY_PLAN',
  ADD_STUDY_PLAN: 'ADD_STUDY_PLAN',
  SET_QUIZZES: 'SET_QUIZZES',
  SET_CURRENT_QUIZ: 'SET_CURRENT_QUIZ',
  ADD_QUIZ_RESULT: 'ADD_QUIZ_RESULT',
  SET_SESSION_ID: 'SET_SESSION_ID',
  CLEAR_ERROR: 'CLEAR_ERROR',
  // Autenticação
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case ACTIONS.SET_STUDY_PLAN:
      return { ...state, currentStudyPlan: action.payload };
    case ACTIONS.ADD_STUDY_PLAN:
      return { 
        ...state, 
        studyPlans: [...state.studyPlans, action.payload],
        currentStudyPlan: action.payload 
      };
    case ACTIONS.SET_QUIZZES:
      return { ...state, quizzes: action.payload };
    case ACTIONS.SET_CURRENT_QUIZ:
      return { ...state, currentQuiz: action.payload };
    case ACTIONS.ADD_QUIZ_RESULT:
      return { 
        ...state, 
        quizResults: [...state.quizResults, action.payload] 
      };
    case ACTIONS.SET_SESSION_ID:
      return { ...state, sessionId: action.payload };
    case ACTIONS.LOGIN_SUCCESS:
      return { 
        ...state, 
        isAuthenticated: true, 
        token: action.payload.token,
        error: null 
      };
    case ACTIONS.LOGOUT:
      return { 
        ...state, 
        isAuthenticated: false, 
        user: null, 
        token: null,
        studyPlans: [],
        currentStudyPlan: null,
        quizzes: [],
        currentQuiz: null,
        quizResults: [],
        sessionId: null
      };
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

// Contexto
const AppContext = createContext();

// Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook customizado
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};

