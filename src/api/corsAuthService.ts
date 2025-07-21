import corsFixedApiClient from './corsFixedApiClient';
import { jwtDecode } from 'jwt-decode';
import { APP_CONFIG } from '@/config/environment';

interface JwtPayload {
  sub: string;
  roles: string;
  iat: number;
  exp: number;
}

export const corsLogin = async (email: string, password: string) => {
  try {
    console.log('🔄 Tentative de connexion avec service CORS adaptatif...');
    
    const response = await corsFixedApiClient.post('/auth/login', { 
      email, 
      password 
    });
    
    const token = response.data;
    console.log('✅ Token reçu:', token ? 'Oui' : 'Non');
    
    // Décoder le token pour extraire les informations utilisateur
    const decodedToken = jwtDecode<JwtPayload>(token);
    const user = {
      email: decodedToken.sub,
      roles: [decodedToken.roles], // Le backend retourne les rôles sous forme de string
    };
    
    console.log('✅ Utilisateur décodé:', user);
    return { token, user };
    
  } catch (error: any) {
    console.error('❌ Erreur de connexion:', error);
    
    if (error.response?.status === 400) {
      throw new Error('❌ Identifiants invalides ou erreur de configuration backend');
    } else if (error.response?.status === 401) {
      throw new Error('❌ Email ou mot de passe incorrect');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('❌ Impossible de contacter le serveur. Vérifiez que le backend est démarré.');
    }
    
    throw error;
  }
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
