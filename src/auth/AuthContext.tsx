import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { logInfo, logError } from '@/config/environment';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('binet_admin_token');
    const storedUser = localStorage.getItem('binet_admin_user');
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
        logInfo('Utilisateur authentifié depuis le localStorage', parsedUser);
      } catch (error) {
        logError('Erreur lors de la récupération des données utilisateur', error);
        localStorage.removeItem('binet_admin_token');
        localStorage.removeItem('binet_admin_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (authToken: string, userData: User) => {
    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('binet_admin_token', authToken);
    localStorage.setItem('binet_admin_user', JSON.stringify(userData));
    logInfo('Connexion réussie', userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('binet_admin_token');
    localStorage.removeItem('binet_admin_user');
    logInfo('Déconnexion réussie');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
