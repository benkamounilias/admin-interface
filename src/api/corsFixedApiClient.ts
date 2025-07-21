import axios from 'axios';
import { APP_CONFIG } from '@/config/environment';

// Client API adaptatif pour contourner les problèmes CORS
const corsFixedApiClient = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: APP_CONFIG.REQUEST_TIMEOUT,
  // Désactiver les credentials pour éviter l'erreur CORS
  withCredentials: false,
});

// Intercepteur pour ajouter l'authentification sans credentials
corsFixedApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(APP_CONFIG.AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Headers CORS compatibles
  config.headers['Content-Type'] = 'application/json';
  config.headers['Accept'] = 'application/json';
  
  return config;
});

// Intercepteur de réponse pour gérer les erreurs CORS
corsFixedApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
      console.error('🚨 ERREUR CORS DÉTECTÉE:', error.message);
      console.log('💡 SOLUTION: Le backend doit corriger sa configuration CORS');
      console.log('🔧 Voir CorsConfig.java dans le backend');
    }
    return Promise.reject(error);
  }
);

export default corsFixedApiClient;
