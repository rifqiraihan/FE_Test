import axiosInstance from './axiosInstance';

export const getAllLalins = async () => {
  try {
    const response = await axiosInstance.get('/lalins');
    return response.data;
  } catch (error) {
    console.error('Error fetching lalins:', error);
    throw error;
  }
};
