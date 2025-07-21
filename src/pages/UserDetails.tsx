import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Grid,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  Email,
  CalendarToday,
  AccountBalance,
  School,
  Work,
  AdminPanelSettings,
  Person,
  History,
  Assignment,
  CheckCircle,
} from '@mui/icons-material';
import { userCRUDService } from '../api/userCRUDService';
import { User } from '../types';
import { binetColors } from '../theme/binetTheme';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [editForm, setEditForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    solde: 0
  });

  useEffect(() => {
    if (id) {
      fetchUserDetails();
    } else {
      setError('Aucun ID d\'utilisateur fourni');
      setLoading(false);
    }
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const userData = await userCRUDService.getUserById(id!);
      setUser(userData);
      setEditForm({
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        solde: userData.solde
      });
    } catch (err) {
      console.error('Erreur lors du chargement des détails:', err);
      setError('Erreur lors du chargement des détails de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      await userCRUDService.updateUser(id!, editForm);
      setEditDialogOpen(false);
      fetchUserDetails();
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      setError('Erreur lors de la modification de l\'utilisateur');
    }
  };

  const handleDelete = async () => {
    try {
      await userCRUDService.deleteUser(id!);
      setDeleteDialogOpen(false);
      navigate('/users');
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return <AdminPanelSettings />;
      case 'ROLE_PROFESSEUR':
        return <School />;
      case 'ROLE_PROFESSIONNEL':
        return <Work />;
      case 'ROLE_ETUDIANT':
        return <Person />;
      default:
        return <Person />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return '#e53e3e';
      case 'ROLE_PROFESSEUR':
        return binetColors.primary;
      case 'ROLE_PROFESSIONNEL':
        return '#38a169';
      case 'ROLE_ETUDIANT':
        return '#3182ce';
      default:
        return '#718096';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'Administrateur';
      case 'ROLE_PROFESSEUR':
        return 'Professeur';
      case 'ROLE_PROFESSIONNEL':
        return 'Professionnel';
      case 'ROLE_ETUDIANT':
        return 'Étudiant';
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/users')}
        >
          Retour aux utilisateurs
        </Button>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box>
        <Alert severity="info" sx={{ mb: 2 }}>
          Utilisateur non trouvé
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/users')}
        >
          Retour aux utilisateurs
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={() => navigate('/users')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight={700} color={binetColors.primary}>
            Détails de l'utilisateur
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/users/edit/${id}`)}
          >
            Modifier
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Supprimer
          </Button>
        </Box>
      </Box>

      {/* Profile Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: binetColors.primary,
                  fontSize: '2rem',
                  fontWeight: 700
                }}
              >
                {user.prenom[0]}{user.nom[0]}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {user.prenom} {user.nom}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {user.email}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                {user.roles.map((role) => (
                  <Chip
                    key={role}
                    icon={getRoleIcon(role)}
                    label={getRoleLabel(role)}
                    sx={{
                      bgcolor: getRoleColor(role),
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                <Typography variant="h4" fontWeight={700} color={binetColors.primary}>
                  {user.solde.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  DH
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Solde actuel
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            aria-label="user details tabs"
          >
            <Tab
              icon={<Person />}
              label="Informations personnelles"
              id="user-tab-0"
              aria-controls="user-tabpanel-0"
            />
            <Tab
              icon={<History />}
              label="Historique"
              id="user-tab-1"
              aria-controls="user-tabpanel-1"
            />
            <Tab
              icon={<Assignment />}
              label="Publications"
              id="user-tab-2"
              aria-controls="user-tabpanel-2"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Nom complet"
                    secondary={`${user.prenom} ${user.nom}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={user.email}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText
                    primary="Date de création"
                    secondary="Non disponible"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccountBalance />
                  </ListItemIcon>
                  <ListItemText
                    primary="Solde"
                    secondary={`${user.solde.toLocaleString()} DH`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Statut"
                    secondary="Actif"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Historique des activités
          </Typography>
          <Alert severity="info">
            L'historique des activités sera disponible prochainement.
          </Alert>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Publications de l'utilisateur
          </Typography>
          <Alert severity="info">
            La liste des publications sera disponible prochainement.
          </Alert>
        </TabPanel>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier l'utilisateur</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Prénom"
                value={editForm.prenom}
                onChange={(e) => setEditForm({ ...editForm, prenom: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nom"
                value={editForm.nom}
                onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Solde (DH)"
                type="number"
                value={editForm.solde}
                onChange={(e) => setEditForm({ ...editForm, solde: Number(e.target.value) })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleEdit} variant="contained">
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{user.prenom} {user.nom}</strong> ?
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDetails;
