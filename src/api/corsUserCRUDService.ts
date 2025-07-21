import corsFixedApiClient from './corsFixedApiClient';
import { User } from '@/types';

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
  etablissement?: string;
  departement?: string;
  grade?: string;
  // Champs spécifiques professionnel
  entreprise?: string;
  secteur?: string;
  poste?: string;
  niveauAcces?: string;
}

class CorsFriendlyUserService {
  
  async getAllUsers(): Promise<User[]> {
    try {
      console.log('🔄 Tentative de récupération des utilisateurs...');
      const response = await corsFixedApiClient.get('/users');
      console.log('✅ Utilisateurs récupérés avec succès:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
      
      if (error.response?.status === 400) {
        throw new Error('❌ Backend: Erreur 400 - Configuration CORS invalide. Le backend doit corriger allowCredentials + allowedOrigins.');
      } else if (error.response?.status === 401) {
        throw new Error('❌ Non autorisé: Token invalide ou manquant');
      } else if (error.response?.status === 403) {
        throw new Error('❌ Accès interdit: Permissions insuffisantes');
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('❌ Erreur réseau: Vérifiez que le backend est démarré sur localhost:8080');
      }
      
      throw error;
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await corsFixedApiClient.post('/users', userData);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur création utilisateur:', error);
      throw this.handleError(error);
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const response = await corsFixedApiClient.get(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async updateUser(id: string, userData: Partial<CreateUserRequest>): Promise<User> {
    try {
      const response = await corsFixedApiClient.put(`/users/${id}`, userData);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await corsFixedApiClient.delete(`/users/${id}`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.status === 400) {
      return new Error('❌ Requête invalide - Vérifiez les données envoyées');
    } else if (error.response?.status === 401) {
      return new Error('❌ Non autorisé - Connectez-vous à nouveau');
    } else if (error.response?.status === 403) {
      return new Error('❌ Accès interdit - Permissions insuffisantes');
    } else if (error.response?.status === 404) {
      return new Error('❌ Utilisateur non trouvé');
    } else if (error.code === 'ERR_NETWORK') {
      return new Error('❌ Erreur réseau - Backend non accessible');
    }
    return error;
  }
}

export const corsUserCRUDService = new CorsFriendlyUserService();
export default corsUserCRUDService;
