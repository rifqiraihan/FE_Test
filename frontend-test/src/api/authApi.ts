import axiosInstance from './axiosInstance';

interface ILoginResponse {
  status: boolean;
  message: string;
  code: number;
  is_logged_in: number;
  token: string;
}

export const login = async (credentials: { username: string; password: string }): Promise<ILoginResponse> => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data; 
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
