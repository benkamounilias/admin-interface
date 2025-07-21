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
  
  const token = response.data;
  
  // Décoder le token pour extraire les informations utilisateur
  const decodedToken = jwtDecode<JwtPayload>(token);
  const user = {
    email: decodedToken.sub,
    roles: [decodedToken.roles], // Le backend retourne les rôles sous forme de string
  };
  
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
  return user?.roles?.includes(role) || false;
};

export default {
  login,
  getCurrentUser,
  logout,
  hasRole,
};
