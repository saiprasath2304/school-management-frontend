import axios from 'axios';

// Get baseline URL from typical Vite env setups or fallback to localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'https://xjrf6b92-8000.inc1.devtunnels.ms';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token and Subdomain bypass handler
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // For local development on localhost, we enforce the demo tenant via header
  // In production, the subdomain will naturally handle this.
  config.headers['X-School-Subdomain'] = 'demo';
  
  return config;
});

// Response interceptor to handle token refresh automatically if a 401 is triggered
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${BASE_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });
        localStorage.setItem('access_token', response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (e) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
