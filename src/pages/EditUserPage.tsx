import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import UserForm from '../components/UserForm';
import userService from '@/api/userService';
import { Utilisateur } from '../types';

const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!id) {
        setError('ID utilisateur manquant');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userData = await userService.getUserById(id);
        setUser(userData);
      } catch (error: any) {
        setError(error.message || 'Erreur lors du chargement de l\'utilisateur');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const handleSuccess = () => {
    navigate('/users');
  };

  const handleCancel = () => {
    navigate('/users');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={handleCancel} startIcon={<ArrowBackIcon />}>
          Retour à la liste
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link 
          color="inherit" 
          href="/users" 
          onClick={(e) => { e.preventDefault(); navigate('/users'); }}
          sx={{ cursor: 'pointer' }}
        >
          Utilisateurs
        </Link>
        <Typography color="text.primary">
          Modifier {user?.nom} {user?.prenom}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          onClick={handleCancel}
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
        >
          Retour
        </Button>
        <Typography variant="h4" component="h1">
          Modifier l'utilisateur
        </Typography>
      </Box>

      {/* Form */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <UserForm
          open={true}
          onClose={handleCancel}
          onSuccess={handleSuccess}
          user={user}
          mode="edit"
        />
      </Paper>
    </Container>
  );
};

export default EditUserPage;
