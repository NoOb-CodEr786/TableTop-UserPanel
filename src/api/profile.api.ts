import axiosInstance from './axiosInstance';

export interface UserProfileResponse {
  _id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  coins: number;
  profileImage: string | null;
  avatar: string | null;
  role: string;
  googleId: string | null;
  authProvider: string;
  isOAuthUser: boolean;
  createdAt: string;
  updatedAt: string;
  googleProfile: {
    picture: string | null;
    locale: string | null;
    verified_email: boolean;
  };
}

export interface EditProfileData {
  name?: string;
  username?: string;
  phone?: string;
  profileImage?: File;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// Get current user profile
export const getCurrentUserProfile = async (): Promise<ApiResponse<UserProfileResponse>> => {
  const response = await axiosInstance.get('/auth/user/profile');
  return response.data;
};

// Edit user profile
export const editUserProfile = async (data: EditProfileData): Promise<ApiResponse<UserProfileResponse>> => {
  const formData = new FormData();
  
  if (data.name) formData.append('name', data.name);
  if (data.username) formData.append('username', data.username);
  if (data.phone) formData.append('phone', data.phone);
  if (data.profileImage) formData.append('profileImage', data.profileImage);

  const response = await axiosInstance.put('/auth/user/edit-profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Change password
export const changePassword = async (data: ChangePasswordData): Promise<ApiResponse> => {
  const response = await axiosInstance.post('/auth/user/change-password', data);
  return response.data;
};

// Logout current session
export const logoutCurrentSession = async (): Promise<ApiResponse> => {
  const response = await axiosInstance.post('/auth/user/logout');
  return response.data;
};

// Logout all sessions
export const logoutAllSessions = async (): Promise<ApiResponse> => {
  const response = await axiosInstance.post('/auth/user/logout-all');
  return response.data;
};