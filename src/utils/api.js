import axios from 'axios';

// Automatically detect API URL based on environment
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // For production: use same domain as frontend
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `${window.location.protocol}//${window.location.hostname}/api`;
  }
  
  // For local development
  return 'http://localhost:5555/api';
};

const API = axios.create({
  baseURL: getApiUrl(),
});

// Add a request interceptor to add the auth token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't redirect if we're already on the login page or trying to login
      const isLoginRequest = error.config.url.includes('/auth/login');
      const isLoginPage = window.location.pathname === '/login';

      if (!isLoginRequest && !isLoginPage) {
        // Clear token and user info
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Force redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
