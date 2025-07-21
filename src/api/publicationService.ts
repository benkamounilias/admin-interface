import axios from 'axios';
import { APP_CONFIG } from '@/config/environment';

const getAuthToken = () => localStorage.getItem(APP_CONFIG.AUTH_TOKEN_KEY);

const apiClient = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: APP_CONFIG.REQUEST_TIMEOUT,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getPublications = async () => {
  const response = await apiClient.get('/api/publications');
  return response.data;
};

export const getPublicationById = async (id: string) => {
  const response = await apiClient.get(`/api/publications/${id}`);
  return response.data;
};

export const createPublication = async (publicationData: any) => {
  const response = await apiClient.post('/api/publications', publicationData);
  return response.data;
};

export const updatePublication = async (id: string, publicationData: any) => {
  const response = await apiClient.put(`/api/publications/${id}`, publicationData);
  return response.data;
};

export const deletePublication = async (id: string) => {
  const response = await apiClient.delete(`/api/publications/${id}`);
  return response.data;
};

export default {
  getPublications,
  getPublicationById,
  createPublication,
  updatePublication,
  deletePublication,
};
