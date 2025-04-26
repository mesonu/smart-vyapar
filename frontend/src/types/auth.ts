export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  phone?: string;
  address?: string;
  businessName?: string;
  businessType?: string;
  gstNumber?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  businessName: string;
  businessType: string;
  gstNumber?: string;
  address: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  businessType?: string;
  gstNumber?: string;
  address?: string;
  avatar?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
} 