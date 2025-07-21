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

export const getReports = async () => {
  const response = await apiClient.get('/api/reports');
  return response.data;
};

export const getReportById = async (id: string) => {
  const response = await apiClient.get(`/api/reports/${id}`);
  return response.data;
};

export const updateReportStatus = async (id: string, status: string) => {
  const response = await apiClient.put(`/api/reports/${id}/status`, { status });
  return response.data;
};

export const deleteReport = async (id: string) => {
  const response = await apiClient.delete(`/api/reports/${id}`);
  return response.data;
};

export default {
  getReports,
  getReportById,
  updateReportStatus,
  deleteReport,
};
