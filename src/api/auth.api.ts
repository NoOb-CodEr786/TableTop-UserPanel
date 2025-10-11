import axiosInstance from './axiosInstance';

export interface SignupData {
  name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  profileImage?: File;
}

export interface LoginData {
  emailOrUsername: string;
  password: string;
}

export interface VerifyEmailData {
  email: string;
  otp: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    phone: string;
    profileImage: string | null;
    isEmailVerified: boolean;
    coins: number;
    role: string;
  };
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

// User Signup API
export const userSignup = async (data: SignupData): Promise<ApiResponse<SignupResponse>> => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('username', data.username);
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('phone', data.phone);
  
  if (data.profileImage) {
    formData.append('profileImage', data.profileImage);
  }

  const response = await axiosInstance.post('/auth/user/signup', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// User Login API
export const userLogin = async (data: LoginData): Promise<ApiResponse<LoginResponse>> => {
  const response = await axiosInstance.post('/auth/user/login', data);
  return response.data;
};

// Verify Email OTP API
export const verifyEmailOtp = async (data: VerifyEmailData): Promise<ApiResponse> => {
  const response = await axiosInstance.post('/auth/user/verify-email-otp', data);
  return response.data;
};

// Forgot Password API (if needed)
export const forgotPassword = async (email: string): Promise<ApiResponse> => {
  const response = await axiosInstance.post('/auth/user/forgot-password', { email });
  return response.data;
};

// Reset Password API (if needed)
export const resetPassword = async (token: string, password: string): Promise<ApiResponse> => {
  const response = await axiosInstance.post('/auth/user/reset-password', { 
    token, 
    password 
  });
  return response.data;
};

// Refresh Token API
export const refreshToken = async (): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> => {
  const response = await axiosInstance.post('/auth/refresh');
  return response.data;
};

// Logout API
export const userLogout = async (): Promise<ApiResponse> => {
  const response = await axiosInstance.post('/auth/user/logout');
  return response.data;
};