import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically attach Supabase JWT
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Global Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      // Handle common status codes centrally
      if (status === 401) {
        console.warn('[API 401] Session expired or invalid');
        // Let the AuthContext handle actual logout state
      } else if (status === 403) {
        console.warn('[API 403] Permission Denied');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
