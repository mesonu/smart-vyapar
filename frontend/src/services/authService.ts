import axios from 'axios';
import { LoginCredentials, RegisterData, LoginResponse, UpdateProfileData } from '../types/auth';
import { API_URL } from '../config';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // TODO: Implement token refresh functionality
    /*
     * Refresh Token Implementation Plan:
     * 1. Backend: Implement /api/auth/refresh-token endpoint
     * 2. Frontend: 
     *    - Store refresh token in HTTP-only cookie
     *    - Implement token rotation
     *    - Add expiration handling
     * 3. Security: Use secure cookies, implement blacklisting
     * 4. Error Handling: Handle expiration, concurrent requests
     */

    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   try {
    //     const response = await api.post('/api/auth/refresh-token');
    //     const { token } = response.data;
    //     localStorage.setItem('token', token);
    //     originalRequest.headers.Authorization = `Bearer ${token}`;
    //     return api(originalRequest);
    //   } catch (refreshError) {
    //     localStorage.removeItem('token');
    //     window.location.href = '/login';
    //     return Promise.reject(refreshError);
    //   }
    // }

    return Promise.reject(error);
  }
);

const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/api/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
    const { token, user } = response.data;
    
    // Store token and user data
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  async register(userData: RegisterData): Promise<void> {
    await api.post('/api/auth/register', userData);
  },

  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } finally {
      // Clear auth data regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

  async getProfile(): Promise<any> {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  async updateProfile(profileData: UpdateProfileData): Promise<any> {
    const response = await api.put('/api/auth/profile', profileData);
    return response.data;
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await api.post('/api/auth/change-password', { oldPassword, newPassword });
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/api/auth/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/api/auth/reset-password', { token, newPassword });
  },

  // TODO: Implement token refresh functionality
  // async refreshToken(): Promise<any> {
  //   const response = await api.post('/api/auth/refresh-token');
  //   return response.data;
  // },

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  // Helper method to get current user
  getCurrentUser(): any | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export default authService; 