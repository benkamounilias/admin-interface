import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Configuration
import { APP_CONFIG, logInfo } from '@/config/environment';

// Contextes d'authentification
import { AuthProvider } from '@/auth/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import UserFormPage from './pages/UserFormPage';
import UserDetails from './pages/UserDetails';
import Messages from './pages/Messages';
import Categories from './pages/Categories';
import Publications from './pages/Publications';
import Reports from './pages/Reports';

// Composants
import Layout from './components/Layout';
import ProtectedRoute from './routes/ProtectedRoute';

// Thème
import binetTheme from './theme/binetTheme';

const AppReal: React.FC = () => {
  // Log du mode actuel
  React.useEffect(() => {
    logInfo(`Application démarrée en mode adaptatif`);
    logInfo(`Backend URL: ${APP_CONFIG.API_BASE_URL}`);
  }, []);

  return (
    <ThemeProvider theme={binetTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Route de connexion */}
            <Route path="/login" element={<Login />} />
            {/* Routes protégées */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Routes enfants dans le Layout - utiliser des chemins relatifs */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/create" element={<UserFormPage />} />
              <Route path="users/edit/:id" element={<UserFormPage />} />
              <Route path="users/:id" element={<UserDetails />} />
              <Route path="messages" element={<Messages />} />
              <Route path="categories" element={<Categories />} />
              <Route path="publications" element={<Publications />} />
              <Route path="reports" element={<Reports />} />
            </Route>
            {/* Route par défaut pour les URLs non trouvées */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppReal;
