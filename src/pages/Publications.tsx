import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { Publication, PublicationFilters } from '../types';

// Données de démonstration
const mockPublications: Publication[] = [
  {
    id: '1',
    title: 'Intelligence Artificielle dans l\'Éducation Marocaine',
    description: 'Une étude approfondie sur l\'impact de l\'IA dans le système éducatif marocain',
    type: 'ARTICLE',
    status: 'PENDING',
    price: 150,
    authorId: '1',
    author: {
      id: '1',
      email: 'ahmed.benali@ucd.ac.ma',
      nom: 'Ben Ali',
      prenom: 'Ahmed',
      dateInscription: '2024-01-15T10:30:00Z',
      solde: 0,
      roles: [{ name: 'ROLE_ETUDIANT' }],
      _class: 'ma.ppam.userservice.model.Etudiant'
    },
    categoryId: '1',
    category: {
      id: '1',
      name: 'Informatique',
      description: 'Sciences informatiques et technologie',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    createdAt: '2024-01-20T08:30:00Z',
    updatedAt: '2024-01-20T08:30:00Z',
  },
  {
    id: '2',
    title: 'Mémoire sur le Marketing Digital au Maroc',
    description: 'Analyse des stratégies de marketing digital adoptées par les entreprises marocaines',
    type: 'MEMOIR',
    status: 'APPROVED',
    price: 200,
    authorId: '2',
    author: {
      id: '2',
      email: 'fatima.alami@ucd.ac.ma',
      nom: 'Al Alami',
      prenom: 'Fatima',
      dateInscription: '2024-01-10T14:20:00Z',
      solde: 0,
      roles: [{ name: 'ROLE_PROFESSEUR' }],
      _class: 'ma.ppam.userservice.model.Professeur'
    },
    categoryId: '2',
    category: {
      id: '2',
      name: 'Économie',
      description: 'Sciences économiques et gestion',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    createdAt: '2024-01-18T14:15:00Z',
    updatedAt: '2024-01-18T14:15:00Z',
  },
];

const Publications: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filters, setFilters] = useState<PublicationFilters>({});

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetchPublications();
  }, [paginationModel, filters]);

  const fetchPublications = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPublications(mockPublications);
    } catch (err) {
      setError('Erreur lors du chargement des publications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePublication = async (publicationId: string) => {
    try {
      setPublications(prevPubs =>
        prevPubs.map(pub =>
          pub.id === publicationId ? { ...pub, status: 'APPROVED' as const } : pub
        )
      );
    } catch (err) {
      setError('Erreur lors de l\'approbation');
    }
  };

  const handleRejectPublication = async (publicationId: string) => {
    window.prompt('Raison du rejet (optionnel):');
    try {
      setPublications(prevPubs =>
        prevPubs.map(pub =>
          pub.id === publicationId ? { ...pub, status: 'REJECTED' as const } : pub
        )
      );
    } catch (err) {
      setError('Erreur lors du rejet');
    }
  };

  const handleViewPublication = (publication: Publication) => {
    setSelectedPublication(publication);
    setOpenDialog(true);
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } = {
      PENDING: 'warning',
      APPROVED: 'success',
      REJECTED: 'error',
    };
    return statusColors[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: { [key: string]: string } = {
      PENDING: 'En attente',
      APPROVED: 'Approuvée',
      REJECTED: 'Rejetée',
    };
    return statusLabels[status] || status;
  };

  const getTypeLabel = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      ARTICLE: 'Article',
      MEMOIR: 'Mémoire',
      PROJECT: 'Projet',
      REPORT: 'Rapport',
    };
    return typeLabels[type] || type;
  };

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Titre',
      width: 250,
    },
    {
      field: 'author',
      headerName: 'Auteur',
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {params.row.author.prenom[0]}{params.row.author.nom[0]}
          </Avatar>
          <Box>
            <Typography variant="body2">
              {params.row.author.prenom} {params.row.author.nom}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={getTypeLabel(params.value)}
          color="primary"
          size="small"
        />
      ),
    },
    {
      field: 'category',
      headerName: 'Catégorie',
      width: 150,
      valueGetter: (params) => params.row.category.name,
    },
    {
      field: 'status',
      headerName: 'Statut',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={getStatusLabel(params.value)}
          color={getStatusColor(params.value)}
          size="small"
          icon={
            params.value === 'PENDING' ? <PendingIcon /> :
            params.value === 'APPROVED' ? <CheckCircleIcon /> :
            <CancelIcon />
          }
        />
      ),
    },
    {
      field: 'price',
      headerName: 'Prix (MAD)',
      width: 100,
      valueGetter: (params) => `${params.value} MAD`,
    },
    {
      field: 'createdAt',
      headerName: 'Date de création',
      width: 130,
      valueGetter: (params) => new Date(params.value).toLocaleDateString('fr-FR'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Button
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => handleViewPublication(params.row)}
            sx={{ mr: 1 }}
          >
            Voir
          </Button>
          {params.row.status === 'PENDING' && (
            <>
              <Button
                size="small"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => handleApprovePublication(params.row.id)}
                sx={{ mr: 1 }}
              >
                Approuver
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => handleRejectPublication(params.row.id)}
              >
                Rejeter
              </Button>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestion des publications
      </Typography>

      {/* Statistiques rapides */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total publications
              </Typography>
              <Typography variant="h4">
                {publications.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                En attente
              </Typography>
              <Typography variant="h4">
                {publications.filter(p => p.status === 'PENDING').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Approuvées
              </Typography>
              <Typography variant="h4">
                {publications.filter(p => p.status === 'APPROVED').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Rejetées
              </Typography>
              <Typography variant="h4">
                {publications.filter(p => p.status === 'REJECTED').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtres */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              placeholder="Rechercher par titre"
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1 }} />,
              }}
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type || ''}
                label="Type"
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="ARTICLE">Article</MenuItem>
                <MenuItem value="MEMOIR">Mémoire</MenuItem>
                <MenuItem value="PROJECT">Projet</MenuItem>
                <MenuItem value="REPORT">Rapport</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={filters.status || ''}
                label="Statut"
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="PENDING">En attente</MenuItem>
                <MenuItem value="APPROVED">Approuvée</MenuItem>
                <MenuItem value="REJECTED">Rejetée</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Table des publications */}
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={publications}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25]}
          loading={loading}
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Dialog pour voir les détails d'une publication */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Détails de la publication
        </DialogTitle>
        <DialogContent>
          {selectedPublication && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6">{selectedPublication.title}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" color="textSecondary">
                  {selectedPublication.description}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Auteur:</Typography>
                <Typography>
                  {selectedPublication.author.prenom} {selectedPublication.author.nom}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Email:</Typography>
                <Typography>{selectedPublication.author.email}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Type:</Typography>
                <Typography>{getTypeLabel(selectedPublication.type)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Catégorie:</Typography>
                <Typography>{selectedPublication.category.name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Prix:</Typography>
                <Typography>{selectedPublication.price} MAD</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Statut:</Typography>
                <Chip
                  label={getStatusLabel(selectedPublication.status)}
                  color={getStatusColor(selectedPublication.status)}
                  size="small"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Fermer</Button>
          {selectedPublication?.status === 'PENDING' && (
            <>
              <Button
                color="success"
                variant="contained"
                onClick={() => {
                  if (selectedPublication) {
                    handleApprovePublication(selectedPublication.id);
                    setOpenDialog(false);
                  }
                }}
              >
                Approuver
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => {
                  if (selectedPublication) {
                    handleRejectPublication(selectedPublication.id);
                    setOpenDialog(false);
                  }
                }}
              >
                Rejeter
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Publications;
