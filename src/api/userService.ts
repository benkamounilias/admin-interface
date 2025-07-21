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

export const getUsers = async () => {
  const response = await apiClient.get('/api/utilisateurs');
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await apiClient.get(`/api/utilisateurs/${id}`);
  return response.data;
};

export const createUser = async (userData: any) => {
  const response = await apiClient.post('/api/utilisateurs', userData);
  return response.data;
};

export const updateUser = async (id: string, userData: any) => {
  const response = await apiClient.put(`/api/utilisateurs/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await apiClient.delete(`/api/utilisateurs/${id}`);
  return response.data;
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
