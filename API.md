# Documentation API - Interface d'Administration Binet

## Vue d'ensemble

Cette documentation décrit l'architecture API de l'interface d'administration Binet, incluant les endpoints, les formats de données, l'authentification et les stratégies de cache.

## Architecture API

### Configuration de base

```typescript
// apiClient.ts
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Intercepteurs

#### Request Interceptor
```typescript
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('binet_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

#### Response Interceptor
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Déconnexion automatique
      localStorage.removeItem('binet_admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Endpoints d'authentification

### POST /auth/login
Authentification utilisateur avec email et mot de passe.

**Request:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response:**
```typescript
interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

interface User {
  id: string;
  nom: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  statut: 'actif' | 'inactif';
  dateCreation: string;
  derniereConnexion?: string;
}
```

**Exemple:**
```typescript
const response = await apiClient.post('/auth/login', {
  email: 'admin@binet.com',
  password: 'admin123'
});
```

### POST /auth/logout
Déconnexion et invalidation du token.

**Request:** Aucun body requis (token dans headers)

**Response:**
```typescript
interface LogoutResponse {
  message: string;
}
```

### POST /auth/refresh
Renouvellement du token d'authentification.

**Request:**
```typescript
interface RefreshRequest {
  refreshToken: string;
}
```

**Response:**
```typescript
interface RefreshResponse {
  token: string;
  refreshToken: string;
}
```

### GET /auth/me
Récupération des informations de l'utilisateur connecté.

**Response:**
```typescript
interface CurrentUserResponse {
  user: User;
}
```

## Endpoints utilisateurs

### GET /users
Récupération de la liste des utilisateurs avec filtres et pagination.

**Query Parameters:**
```typescript
interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'admin' | 'moderator' | 'user';
  statut?: 'actif' | 'inactif';
  sortBy?: 'nom' | 'email' | 'dateCreation';
  sortOrder?: 'asc' | 'desc';
}
```

**Response:**
```typescript
interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    applied: UsersQueryParams;
    available: {
      roles: string[];
      statuts: string[];
    };
  };
}
```

### GET /users/:id
Récupération d'un utilisateur par son ID.

**Response:**
```typescript
interface UserResponse {
  user: User;
}
```

### POST /users
Création d'un nouvel utilisateur.

**Request:**
```typescript
interface CreateUserRequest {
  nom: string;
  email: string;
  password: string;
  role: 'admin' | 'moderator' | 'user';
  statut: 'actif' | 'inactif';
}
```

**Response:**
```typescript
interface CreateUserResponse {
  user: User;
  message: string;
}
```

### PUT /users/:id
Mise à jour d'un utilisateur existant.

**Request:**
```typescript
interface UpdateUserRequest {
  nom?: string;
  email?: string;
  role?: 'admin' | 'moderator' | 'user';
  statut?: 'actif' | 'inactif';
  password?: string; // Seulement si changement de mot de passe
}
```

**Response:**
```typescript
interface UpdateUserResponse {
  user: User;
  message: string;
}
```

### DELETE /users/:id
Suppression d'un utilisateur.

**Response:**
```typescript
interface DeleteUserResponse {
  message: string;
}
```

### POST /users/bulk-actions
Actions en lot sur les utilisateurs.

**Request:**
```typescript
interface BulkActionRequest {
  userIds: string[];
  action: 'activate' | 'deactivate' | 'delete' | 'changeRole';
  params?: {
    role?: 'admin' | 'moderator' | 'user';
  };
}
```

**Response:**
```typescript
interface BulkActionResponse {
  success: string[];
  failed: {
    id: string;
    error: string;
  }[];
  message: string;
}
```

## Endpoints statistiques

### GET /stats/dashboard
Statistiques pour le tableau de bord.

**Response:**
```typescript
interface DashboardStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    byRole: {
      admin: number;
      moderator: number;
      user: number;
    };
  };
  publications: {
    total: number;
    published: number;
    draft: number;
    recent: number; // 30 derniers jours
  };
  categories: {
    total: number;
  };
  activity: {
    recent: ActivityItem[];
  };
}

interface ActivityItem {
  id: string;
  type: 'user_created' | 'user_updated' | 'publication_created' | 'login';
  user: string;
  target?: string;
  timestamp: string;
  details?: Record<string, any>;
}
```

### GET /stats/users
Statistiques détaillées des utilisateurs.

**Query Parameters:**
```typescript
interface UserStatsParams {
  period?: '7d' | '30d' | '90d' | '1y';
  groupBy?: 'day' | 'week' | 'month';
}
```

**Response:**
```typescript
interface UserStatsResponse {
  growth: {
    labels: string[];
    data: number[];
  };
  distribution: {
    byRole: Record<string, number>;
    byStatus: Record<string, number>;
  };
  activity: {
    registrations: {
      period: number;
      total: number;
    };
    logins: {
      unique: number;
      total: number;
    };
  };
}
```

## Services optimisés

### authServiceOptimized.ts

```typescript
class AuthServiceOptimized {
  private readonly TOKEN_KEY = 'binet_admin_token';
  private readonly USER_KEY = 'binet_admin_user';

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Implémentation avec gestion d'erreurs et localStorage
  }

  async logout(): Promise<void> {
    // Nettoyage des tokens et redirection
  }

  async getCurrentUser(): Promise<User | null> {
    // Vérification et retour de l'utilisateur actuel
  }

  hasPermission(user: User, permission: string): boolean {
    // Vérification des permissions basées sur le rôle
  }
}
```

### userServiceOptimized.ts

```typescript
class UserServiceOptimized {
  async getUsers(params?: UsersQueryParams): Promise<UsersResponse> {
    // Récupération avec cache et pagination
  }

  async getUser(id: string): Promise<User> {
    // Récupération d'un utilisateur avec cache
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    // Création avec validation
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    // Mise à jour optimiste
  }

  async deleteUser(id: string): Promise<void> {
    // Suppression avec confirmation
  }

  async bulkAction(action: BulkActionRequest): Promise<BulkActionResponse> {
    // Actions en lot avec rollback
  }
}
```

### realCRUDServiceOptimized.ts

```typescript
class RealCRUDServiceOptimized<T> {
  constructor(private endpoint: string) {}

  async getAll(params?: Record<string, any>): Promise<T[]> {
    // CRUD générique pour toutes les entités
  }

  async getById(id: string): Promise<T> {
    // Récupération par ID avec cache
  }

  async create(data: Partial<T>): Promise<T> {
    // Création générique
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    // Mise à jour générique
  }

  async delete(id: string): Promise<void> {
    // Suppression générique
  }
}
```

## Gestion d'erreurs

### Types d'erreurs

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

interface ValidationError {
  field: string;
  message: string;
  value?: any;
}
```

### Codes d'erreur standardisés

| Code | Description | Action suggérée |
|------|-------------|-----------------|
| AUTH_001 | Token invalide | Redirection vers login |
| AUTH_002 | Token expiré | Refresh du token |
| AUTH_003 | Permissions insuffisantes | Message d'erreur |
| USER_001 | Utilisateur non trouvé | Redirection ou message |
| USER_002 | Email déjà utilisé | Validation du formulaire |
| VAL_001 | Données invalides | Affichage des erreurs de validation |
| SYS_001 | Erreur serveur | Message générique + retry |

### Gestion centralisée

```typescript
class ErrorHandler {
  static handle(error: any): void {
    if (error.response?.data?.code) {
      switch (error.response.data.code) {
        case 'AUTH_001':
        case 'AUTH_002':
          AuthService.logout();
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    }
  }
}
```

## Cache et performance

### Stratégies de cache

#### 1. Cache navigateur
```typescript
// Headers de cache pour les ressources statiques
apiClient.defaults.headers.common['Cache-Control'] = 'max-age=3600';
```

#### 2. Cache en mémoire
```typescript
class CacheManager {
  private cache = new Map<string, { data: any; expiry: number }>();

  set(key: string, data: any, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }

  get(key: string): any {
    const item = this.cache.get(key);
    if (item && item.expiry > Date.now()) {
      return item.data;
    }
    this.cache.delete(key);
    return null;
  }
}
```

#### 3. Cache avec revalidation
```typescript
const useCachedQuery = <T>(
  key: string,
  queryFn: () => Promise<T>,
  options: { staleTime: number; cacheTime: number }
) => {
  // Implémentation avec cache intelligent
};
```

### Optimisation des requêtes

#### 1. Pagination efficace
```typescript
// Cursor-based pagination pour de meilleures performances
interface PaginationCursor {
  cursor?: string;
  limit: number;
}
```

#### 2. Sélection de champs
```typescript
// Requête avec sélection de champs spécifiques
GET /users?fields=id,nom,email,role&limit=50
```

#### 3. Mise à jour optimiste
```typescript
const useOptimisticUpdate = <T>(
  updateFn: (data: T) => Promise<T>
) => {
  // Mise à jour immédiate de l'UI + rollback si erreur
};
```

## Sécurité

### Authentification JWT

```typescript
interface JWTPayload {
  sub: string; // User ID
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
}
```

### Validation côté client

```typescript
// Validation avec Yup
const userSchema = yup.object({
  nom: yup.string().required().min(2).max(100),
  email: yup.string().email().required(),
  role: yup.string().oneOf(['admin', 'moderator', 'user']).required(),
});
```

### Protection CSRF

```typescript
// Token CSRF dans les headers
apiClient.defaults.headers.common['X-CSRF-Token'] = getCsrfToken();
```

## Tests API

### Tests unitaires des services

```typescript
describe('UserService', () => {
  test('should fetch users with correct parameters', async () => {
    const params = { page: 1, limit: 10, role: 'admin' };
    mock.onGet('/users').reply(200, mockUsersResponse);
    
    const result = await userService.getUsers(params);
    expect(result.users).toHaveLength(10);
  });
});
```

### Tests d'intégration

```typescript
describe('User Management Integration', () => {
  test('should create, update and delete user', async () => {
    // Test du flux complet avec vrais appels API
  });
});
```

### Mock des API

```typescript
// Mock pour les tests
const mockApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

jest.mock('../apiClient', () => mockApiClient);
```

## Documentation automatique

### OpenAPI/Swagger

```yaml
# swagger.yml
openapi: 3.0.0
info:
  title: Binet Admin API
  version: 1.0.0
paths:
  /auth/login:
    post:
      summary: Authentification utilisateur
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
```

### Génération TypeScript

```bash
# Génération des types depuis OpenAPI
npx openapi-typescript swagger.yml --output src/types/api.ts
```
