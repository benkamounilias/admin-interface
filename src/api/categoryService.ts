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

export const getCategories = async () => {
  const response = await apiClient.get('/api/categories');
  return response.data;
};

export const getCategoryById = async (id: string) => {
  const response = await apiClient.get(`/api/categories/${id}`);
  return response.data;
};

export const createCategory = async (categoryData: any) => {
  const response = await apiClient.post('/api/categories', categoryData);
  return response.data;
};

export const updateCategory = async (id: string, categoryData: any) => {
  const response = await apiClient.put(`/api/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await apiClient.delete(`/api/categories/${id}`);
  return response.data;
};

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
