import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    phone?: string;
    address?: string;
  };
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  },

  async register(userData: RegisterData): Promise<void> {
    await axios.post(`${API_URL}/auth/register`, userData);
  },

  async logout(): Promise<void> {
    await axios.post(`${API_URL}/auth/logout`);
  },

  async getProfile(): Promise<LoginResponse['user']> {
    const response = await axios.get(`${API_URL}/auth/profile`);
    return response.data;
  },

  async updateProfile(userData: UpdateProfileData): Promise<LoginResponse['user']> {
    const response = await axios.put(`${API_URL}/auth/profile`, userData);
    return response.data;
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await axios.post(`${API_URL}/auth/change-password`, { oldPassword, newPassword });
  },

  async forgotPassword(email: string): Promise<void> {
    await axios.post(`${API_URL}/auth/forgot-password`, { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword });
  },
};

export default authService; 