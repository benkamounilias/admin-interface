import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { APP_CONFIG } from '@/config/environment';

interface JwtPayload {
  sub: string;
  roles: string;
  iat: number;
  exp: number;
}

export const login = async (email: string, password: string) => {
  const response = await axios.post(
    `${APP_CONFIG.API_BASE_URL}/auth/login`,
    { email, password },
    { timeout: APP_CONFIG.REQUEST_TIMEOUT }
  );
  
  // Vérifier et extraire le token de la réponse
  console.log('Réponse du backend:', response.data);
  const token = typeof response.data === 'string' ? response.data : response.data.token || response.data.accessToken;
  
  if (!token || typeof token !== 'string') {
    throw new Error('Token JWT invalide reçu du backend');
  }
  
  localStorage.setItem(APP_CONFIG.AUTH_TOKEN_KEY, token);

  // Décoder le token pour extraire les informations utilisateur
  const decodedToken = jwtDecode<JwtPayload>(token);
  const user = {
    email: decodedToken.sub,
    roles: decodedToken.roles.split(',').map(role => 
      // Nettoyer les rôles pour éviter la duplication de "ROLE_"
      role.startsWith('ROLE_ROLE_') ? role.replace('ROLE_ROLE_', 'ROLE_') : role
    ),
  };
  
  // Sauvegarder l'utilisateur dans le localStorage
  localStorage.setItem(APP_CONFIG.AUTH_USER_KEY, JSON.stringify(user));
  
  return { token, user };
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(APP_CONFIG.AUTH_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem(APP_CONFIG.AUTH_TOKEN_KEY);
  localStorage.removeItem(APP_CONFIG.AUTH_USER_KEY);
  window.location.href = '/login';
};

export const hasRole = (role: string) => {
  const user = getCurrentUser();
  console.log('🔍 Vérification du rôle:', role);
  console.log('👤 Utilisateur récupéré:', user);
  console.log('🎭 Rôles de l\'utilisateur:', user?.roles);
  return user?.roles?.includes(role) || false;
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem(APP_CONFIG.AUTH_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Utilise ces headers dans axios pour les requêtes protégées

// Fonction utilitaire pour requête protégée /users

export default {
  login,
  getCurrentUser,
  logout,
  hasRole,
  getAuthHeaders,
};
