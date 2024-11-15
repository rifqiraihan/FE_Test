import { IDeleteGerbangResponse, IGerbang, IGerbangApiResponse, ISaveGerbangResponse } from '../interfaces/gerbang';
import axiosInstance from './axiosInstance';

export const getAllGerbangs = async (): Promise<IGerbangApiResponse> => {
  try {
    const response = await axiosInstance.get('/gerbangs');
    return response.data;
  } catch (error) {
    console.error('Error fetching gerbangs:', error);
    throw error;
  }
};

export const createGerbang = async (gerbangData: IGerbang): Promise<ISaveGerbangResponse> => {
  try {
    const token = localStorage.getItem('token');
    console.log(token)
    const response = await axiosInstance.post('/gerbangs', gerbangData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating gerbang:', error);
    throw error;
  }
};

export const editGerbang = async (gerbangData: IGerbang): Promise<ISaveGerbangResponse> => {
  try {
    const token = localStorage.getItem('token');
    console.log(token)
    const response = await axiosInstance.put('/gerbangs', gerbangData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating gerbang:', error);
    throw error;
  }
};


export const deleteGerbang = async (value: IGerbang): Promise<IDeleteGerbangResponse> => {
  try {
    const { id, IdCabang } = value;

    const response = await axiosInstance.delete('/gerbangs', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: { id, IdCabang },
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting gerbang:', error);
    throw error;
  }
};