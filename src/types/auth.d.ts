// User types
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  profileImage: string | null;
  isEmailVerified: boolean;
  coins: number;
  role: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// Auth types
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface SignupResponse {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  profileImage: string | null;
  isEmailVerified: boolean;
  coins: number;
}

// Form types
export interface SignupFormData {
  name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  profileImage?: File;
}

export interface LoginFormData {
  emailOrUsername: string;
  password: string;
}

export interface VerifyEmailFormData {
  email: string;
  otp: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  token: string;
  password: string;
}