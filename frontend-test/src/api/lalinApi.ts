import { ILalinApiResponse } from '../interfaces/lalin';
import axiosInstance from './axiosInstance';

export const getLalins = async (date: string): Promise<ILalinApiResponse> => {
  try {
      const response = await axiosInstance.get<ILalinApiResponse>(`/lalins?tanggal=${date}`);
      return response.data;
  } catch (error) {
      console.error('Error fetching lalins:', error);
      throw error;
  }
};
