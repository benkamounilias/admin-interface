// Types pour l'authentification selon votre architecture user-service backend
export interface Role {
  id?: string;
  name: 'ROLE_ETUDIANT' | 'ROLE_PROFESSEUR' | 'ROLE_PROFESSIONNEL' | 'ROLE_ADMIN';
}

// Interface UtilisateurDTO qui correspond exactement au backend
export interface UtilisateurDTO {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  solde: number;
  roles: string[]; // Set<String> en Java devient string[] côté client
  
  // Champs spécifiques Etudiant
  ecole?: string;
  universite?: string;
  specialite?: string;
  niveau?: string;
  
  // Champs spécifiques Professeur
  domaineRecherche?: string;
  grade?: string;
  
  // Champs spécifiques Professionnel
  entreprise?: string;
  secteur?: string;
  poste?: string;
  
  // Champs spécifiques Administrateur
  niveauAcces?: string;
}

// Alias pour compatibilité avec le code existant
export type User = UtilisateurDTO;

// Interface de base Utilisateur (classe abstraite) - correspond au backend
export interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  password?: string; // Optionnel côté client car hashé
  solde: number; // Correspond au backend
  roles: Role[]; // Set<Role> en Java devient Role[] côté client
  _class: string; // Champ MongoDB pour polymorphisme
}

// Sous-classes concrètes
export interface Etudiant extends Utilisateur {
  _class: 'ma.ppam.userservice.model.Etudiant';
  ecole?: string;
  specialite?: string;
  niveau?: string;
}

export interface Professeur extends Utilisateur {
  _class: 'ma.ppam.userservice.model.Professeur';
  universite?: string;
  domaineRecherche?: string;
  grade?: string;
}

export interface Professionnel extends Utilisateur {
  _class: 'ma.ppam.userservice.model.Professionnel';
  entreprise?: string;
  secteur?: string;
  poste?: string;
}

export interface Administrateur extends Utilisateur {
  _class: 'ma.ppam.userservice.model.Administrateur';
  niveauAcces: 'SUPER' | 'ADMIN' | 'MODERATEUR';
}

// Types pour les requêtes d'authentification (correspond au backend)
export interface LoginRequest {
  email: string;
  password: string;
}

// Réponse du backend d'authentification (seulement le JWT)
export interface AuthResponse {
  token: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  type: 'ETUDIANT' | 'PROFESSEUR' | 'PROFESSIONNEL' | 'ADMINISTRATEUR';
}

// DTOs pour les opérations CRUD
export interface CreateUtilisateurDTO {
  nom: string;
  prenom: string;
  email: string;
  password: string; // En clair, sera hashé côté backend
  type: 'ETUDIANT' | 'PROFESSEUR' | 'PROFESSIONNEL' | 'ADMINISTRATEUR';
  roles: string[]; // Liste des noms de rôles
  // Champs spécifiques selon le type
  [key: string]: any;
}

export interface UpdateUtilisateurDTO {
  nom?: string;
  prenom?: string;
  email?: string;
  roles?: string[];
  // Champs spécifiques selon le type
  [key: string]: any;
}

// Types pour les publications
export interface Publication {
  id: string;
  title: string;
  description: string;
  type: 'ARTICLE' | 'MEMOIR' | 'PROJECT' | 'REPORT';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  price: number;
  authorId: string;
  author: User;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
  filePath?: string;
  thumbnailPath?: string;
}

// Types pour les catégories
export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Types pour les signalements
export interface Report {
  id: string;
  reason: string;
  description: string;
  publicationId: string;
  publication: Publication;
  reporterId: string;
  reporter: User;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  updatedAt: string;
}

// Types pour les statistiques du dashboard
export interface DashboardStats {
  totalUsers: number;
  totalPublications: number;
  totalSales: number;
  totalRevenue: number;
  pendingPublications: number;
  pendingReports: number;
  usersByRole: {
    students: number;
    professors: number;
    professionals: number;
  };
  publicationsByType: {
    articles: number;
    memoirs: number;
    projects: number;
    reports: number;
  };
  recentActivity: {
    newUsers: number;
    newPublications: number;
    newSales: number;
  };
}

// Types pour les réponses API adaptés à Spring Boot
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Types pour les filtres et recherche adaptés à votre API
export interface UserFilters {
  role?: string; // ROLE_ADMIN, ROLE_ETUDIANT, etc.
  type?: string; // ETUDIANT, PROFESSEUR, etc.
  search?: string; // Recherche par nom, prénom, email
  status?: string; // ACTIVE, INACTIVE, BANNED
}

export interface PublicationFilters {
  type?: string;
  status?: string;
  categoryId?: string;
  search?: string;
  authorId?: string;
}

export interface ReportFilters {
  status?: string;
  publicationId?: string;
  reporterId?: string;
  search?: string;
}
