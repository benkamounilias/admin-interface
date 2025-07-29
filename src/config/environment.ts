// Configuration pour l'application front
export const APP_CONFIG = {
  MODE: 'real' as 'mock' | 'real', // ✅ MODE REAL - Backend configuré et opérationnel
  API_BASE_URL: 'http://localhost:8080', // URL du backend
  APP_PORT: 3001,
  AUTH_TOKEN_KEY: 'binet_admin_token',
  AUTH_USER_KEY: 'binet_admin_user',
  REQUEST_TIMEOUT: 10000,
  DEV_MODE: true,
  ENABLE_CONSOLE_LOGS: true,
} as const;

export const isMockMode = () => APP_CONFIG.MODE === 'mock';
export const isRealMode = () => APP_CONFIG.MODE === 'real';

export const logInfo = (message: string, ...args: any[]) => {
  if (APP_CONFIG.ENABLE_CONSOLE_LOGS) {
    console.log(`[BINET-ADMIN] ${message}`, ...args);
  }
};

export const logError = (message: string, ...args: any[]) => {
  if (APP_CONFIG.ENABLE_CONSOLE_LOGS) {
    console.error(`[BINET-ADMIN ERROR] ${message}`, ...args);
  }
};

export const logWarn = (message: string, ...args: any[]) => {
  if (APP_CONFIG.ENABLE_CONSOLE_LOGS) {
    console.warn(`[BINET-ADMIN WARN] ${message}`, ...args);
  }
};
