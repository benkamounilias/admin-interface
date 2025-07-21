import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import UserFormPage from './pages/UserFormPage';
import UserDetails from './pages/UserDetails';
import Publications from './pages/Publications';
import Reports from './pages/Reports';
import Categories from './pages/Categories';
import Layout from './components/Layout';
import binetTheme from './theme/binetTheme';

function App() {
  return (
    <ThemeProvider theme={binetTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Route de connexion */}
          <Route path="/login" element={<Login />} />
          
          {/* Routes protégées */}
          <Route 
            path="/" 
            element={
              <AuthProvider>
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              </AuthProvider>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="users/create" element={<UserFormPage />} />
            <Route path="users/edit/:id" element={<UserFormPage />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="publications" element={<Publications />} />
            <Route path="reports" element={<Reports />} />
            <Route path="categories" element={<Categories />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
