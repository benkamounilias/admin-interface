
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Avatar,
  Container,
  Paper,
  Stack,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  AdminPanelSettings,
  Visibility,
  VisibilityOff,
  LockOutlined,
  EmailOutlined
} from '@mui/icons-material';
import { APP_CONFIG, logError, logInfo } from '@/config/environment';
import { login } from '@/api/authService';
import { binetColors } from '@/theme/binetTheme';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token, user } = await login(email, password);
      
      localStorage.setItem(APP_CONFIG.AUTH_TOKEN_KEY, token);
      localStorage.setItem(APP_CONFIG.AUTH_USER_KEY, JSON.stringify(user));
      logInfo('Connexion réussie', user);
      window.location.href = '/dashboard';
    } catch (err: any) {
      logError('Erreur de connexion', err);
      setError('Identifiants invalides ou serveur indisponible.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@binet.com');
    setPassword('admin123');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: `linear-gradient(135deg, ${binetColors.primary}15 0%, ${binetColors.primary}25 50%, ${binetColors.primary}35 100%)`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm10 0c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }
      }}
    >
      <Container 
        component="main" 
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          py: 4
        }}
      >
        <Card
          elevation={24}
          sx={{
            borderRadius: 4,
            backdropFilter: 'blur(20px)',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            overflow: 'visible'
          }}
        >
          <CardContent sx={{ p: 6 }}>
            {/* Logo et titre */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: binetColors.primary,
                  mb: 3,
                  boxShadow: `0 8px 32px ${binetColors.primary}40`
                }}
              >
                <AdminPanelSettings sx={{ fontSize: 40 }} />
              </Avatar>
              
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: binetColors.primary,
                  mb: 1,
                  textAlign: 'center'
                }}
              >
                BINET
              </Typography>
              
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  textAlign: 'center',
                  fontWeight: 300,
                  letterSpacing: '0.5px'
                }}
              >
                Interface d'Administration
              </Typography>
            </Box>

            {/* Formulaire de connexion */}
            <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  type="email"
                  label="Adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined sx={{ color: binetColors.primary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: binetColors.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: binetColors.primary,
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: binetColors.primary }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: binetColors.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: binetColors.primary,
                      },
                    },
                  }}
                />

                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        color: '#d32f2f'
                      }
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: `linear-gradient(135deg, ${binetColors.primary} 0%, ${binetColors.primary}DD 100%)`,
                    boxShadow: `0 4px 20px ${binetColors.primary}40`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${binetColors.primary}DD 0%, ${binetColors.primary} 100%)`,
                      boxShadow: `0 6px 25px ${binetColors.primary}50`,
                      transform: 'translateY(-1px)',
                    },
                    '&:disabled': {
                      background: 'rgba(0, 0, 0, 0.12)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                  startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : null}
                >
                  {loading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
              </Stack>
            </Box>

            {/* Section test admin */}
            <Box sx={{ mt: 4 }}>
              <Divider sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Compte de démonstration
                </Typography>
              </Divider>
              
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${binetColors.primary}08 0%, ${binetColors.primary}15 100%)`,
                  border: `1px solid ${binetColors.primary}20`
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: binetColors.primary }}>
                  Accès Administrateur
                </Typography>
                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> admin@binet.com
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Mot de passe:</strong> admin123
                  </Typography>
                </Stack>
                <Button
                  onClick={fillAdminCredentials}
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    borderColor: binetColors.primary,
                    color: binetColors.primary,
                    borderRadius: 1.5,
                    '&:hover': {
                      borderColor: binetColors.primary,
                      background: `${binetColors.primary}10`,
                    },
                  }}
                >
                  Utiliser ces identifiants
                </Button>
              </Paper>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="rgba(31, 26, 26, 0.8)">
            © 2025 Binet - Interface d'Administration Sécurisée
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
