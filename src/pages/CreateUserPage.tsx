import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Breadcrumbs,
  Link
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import UserForm from '../components/UserForm';

const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/users');
  };

  const handleCancel = () => {
    navigate('/users');
  };

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
          Nouvel utilisateur
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
          Créer un nouvel utilisateur
        </Typography>
      </Box>

      {/* Form */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <UserForm
          open={true}
          onClose={handleCancel}
          onSuccess={handleSuccess}
          user={null}
          mode="create"
        />
      </Paper>
    </Container>
  );
};

export default CreateUserPage;
