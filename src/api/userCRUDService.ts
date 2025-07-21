import axios from 'axios';
import { APP_CONFIG } from '@/config/environment';
import { User } from '@/types';

// Interface pour les requêtes de création (correspond au CreateUtilisateurDTO)
export interface CreateUserRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  type: 'ETUDIANT' | 'PROFESSEUR' | 'PROFESSIONNEL' | 'ADMINISTRATEUR';
  // Champs spécifiques étudiant
  ecole?: string;
  universite?: string;
  specialite?: string;
  niveau?: string;
  // Champs spécifiques professeur
  domaineRecherche?: string;
  grade?: string;
  // Champs spécifiques professionnel
  entreprise?: string;
  secteur?: string;
  poste?: string;
  // Champs spécifiques administrateur
  niveauAcces?: string;
}

export interface UpdateUserRequest {
  nom?: string;
  prenom?: string;
  email?: string;
  password?: string;
  solde?: number;
  type?: 'ETUDIANT' | 'PROFESSEUR' | 'PROFESSIONNEL' | 'ADMINISTRATEUR';
  ecole?: string;
  specialite?: string;
  niveau?: string;
  universite?: string;
  domaineRecherche?: string;
  grade?: string;
  entreprise?: string;
  secteur?: string;
  poste?: string;
  niveauAcces?: string;
}

class UserCRUDService {
  private getAuthHeaders() {
    const token = localStorage.getItem('binet_admin_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await axios.post(
      `${APP_CONFIG.API_BASE_URL}/users`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        }
      }
    );
    return response.data;
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const response = await axios.get(
        `${APP_CONFIG.API_BASE_URL}/users`,
        {
          headers: {
            ...this.getAuthHeaders()
          }
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Erreur d\'authentification: Token invalide ou manquant. Veuillez vous reconnecter.');
      } else if (error.response?.status === 401) {
        throw new Error('Accès non autorisé. Veuillez vous reconnecter.');
      } else if (error.response?.status === 403) {
        throw new Error('Accès interdit. Vous n\'avez pas les permissions nécessaires.');
      }
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    const response = await axios.get(
      `${APP_CONFIG.API_BASE_URL}/users/${id}`,
      {
        headers: {
          ...this.getAuthHeaders()
        }
      }
    );
    return response.data;
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    const response = await axios.put(
      `${APP_CONFIG.API_BASE_URL}/users/${id}`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        }
      }
    );
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await axios.delete(
      `${APP_CONFIG.API_BASE_URL}/users/${id}`,
      {
        headers: {
          ...this.getAuthHeaders()
        }
      }
    );
  }
}

export const userCRUDService = new UserCRUDService();
