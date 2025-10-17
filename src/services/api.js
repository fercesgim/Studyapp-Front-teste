import axios from 'axios';

// Configuração base da API
const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Serviço de Upload de Materiais
export const uploadMaterials = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await api.post('/upload-materials', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Serviço de Submissão de Respostas
export const submitAnswers = async (sessionId, quizResponses) => {
  const response = await api.post(`/submit-answers?session_id=${sessionId}`, {
    quiz_responses: quizResponses,
  });

  return response.data;
};

// Serviços de Autenticação
export const registerUser = async (username, email, password) => {
  const response = await api.post('/auth/register', {
    username,
    email,
    password,
  });

  return response.data;
};

export const loginUser = async (username, password) => {
  const response = await api.post('/auth/login', {
    username,
    password,
  });

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export default api;

