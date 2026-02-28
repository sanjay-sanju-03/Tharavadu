import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Create a shared axios instance
const api = axios.create({ baseURL: BASE_URL });

// Auto-attach JWT token from localStorage on every request
api.interceptors.request.use((config) => {
    try {
        const stored = localStorage.getItem('tharavad_user');
        if (stored) {
            const { token } = JSON.parse(stored);
            if (token) config.headers['Authorization'] = `Bearer ${token}`;
        }
    } catch {
        // ignore
    }
    return config;
});

// Auto-redirect to login on 401/403
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('tharavad_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
