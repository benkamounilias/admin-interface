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
  Delete as DeleteIcon,
  Search as SearchIcon,
  Report as ReportIcon,
} from '@mui/icons-material';
import { Report, ReportFilters } from '../types';

// Données de démonstration
const mockReports: Report[] = [
  {
    id: '1',
    reason: 'Contenu inapproprié',
    description: 'Cette publication contient du contenu offensant et ne respecte pas les règles de la communauté.',
    publicationId: '1',
    publication: {
      id: '1',
      title: 'Intelligence Artificielle dans l\'Éducation Marocaine',
      description: 'Une étude approfondie sur l\'impact de l\'IA dans le système éducatif marocain',
      type: 'ARTICLE',
      status: 'APPROVED',
      price: 150,
      authorId: '1',
      author: {
        id: '1',
        email: 'ahmed.benali@ucd.ac.ma',
        prenom: 'Ahmed',
        nom: 'Ben Ali',
        roles: [{ name: "ROLE_ETUDIANT" }], 
        _class: "ma.ppam.userservice.model.Etudiant", 
        solde: 0, 
        dateInscription: "2024-01-15T10:30:00Z"
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
    reporterId: '3',
    reporter: {
      id: '3',
      email: 'mohammed.tazi@company.ma',
      prenom: 'Mohammed',
      nom: 'Tazi',
      roles: [{ name: "ROLE_ETUDIANT" }], 
      _class: "ma.ppam.userservice.model.Etudiant", 
      solde: 0, 
      dateInscription: "2024-01-15T10:30:00Z"
    },
    status: 'PENDING',
    createdAt: '2024-01-22T16:45:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
  },
  {
    id: '2',
    reason: 'Plagiat',
    description: 'Je soupçonne que cette publication est un plagiat d\'un article déjà publié.',
    publicationId: '2',
    publication: {
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
        prenom: 'Fatima',
        nom: 'Al Alami',
        roles: [{ name: "ROLE_ETUDIANT" }], 
        _class: "ma.ppam.userservice.model.Etudiant", 
        solde: 0, 
        dateInscription: "2024-01-15T10:30:00Z"
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
    reporterId: '1',
    reporter: {
      id: '1',
      email: 'ahmed.benali@ucd.ac.ma',
      prenom: 'Ahmed',
      nom: 'Ben Ali',
      roles: [{ name: "ROLE_ETUDIANT" }], 
      _class: "ma.ppam.userservice.model.Etudiant", 
      solde: 0, 
      dateInscription: "2024-01-15T10:30:00Z"
    },
    status: 'RESOLVED',
    createdAt: '2024-01-21T11:20:00Z',
    updatedAt: '2024-01-21T11:20:00Z',
  },
];

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({});

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetchReports();
  }, [paginationModel, filters]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReports(mockReports);
    } catch (err) {
      setError('Erreur lors du chargement des signalements');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (reportId: string) => {
    try {
      setReports(prevReports =>
        prevReports.map(report =>
          report.id === reportId ? { ...report, status: 'RESOLVED' as const } : report
        )
      );
    } catch (err) {
      setError('Erreur lors de la résolution du signalement');
    }
  };

  const handleDismissReport = async (reportId: string) => {
    try {
      setReports(prevReports =>
        prevReports.map(report =>
          report.id === reportId ? { ...report, status: 'DISMISSED' as const } : report
        )
      );
    } catch (err) {
      setError('Erreur lors du rejet du signalement');
    }
  };

  const handleDeletePublication = async (publicationId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
      try {
        // TODO: Implémenter l'appel API pour supprimer la publication
      } catch (err) {
        setError('Erreur lors de la suppression de la publication');
      }
    }
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } = {
      PENDING: 'warning',
      RESOLVED: 'success',
      DISMISSED: 'error',
    };
    return statusColors[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: { [key: string]: string } = {
      PENDING: 'En attente',
      RESOLVED: 'Résolu',
      DISMISSED: 'Rejeté',
    };
    return statusLabels[status] || status;
  };

  const columns: GridColDef[] = [
    {
      field: 'reason',
      headerName: 'Motif',
      width: 150,
    },
    {
      field: 'publication',
      headerName: 'Publication signalée',
      width: 250,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {params.row.publication.title}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Par {params.row.publication.author.prenom} {params.row.publication.author.nom}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'reporter',
      headerName: 'Signalé par',
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {params.row.reporter.prenom[0]}{params.row.reporter.nom[0]}
          </Avatar>
          <Box>
            <Typography variant="body2">
              {params.row.reporter.prenom} {params.row.reporter.nom}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {params.row.reporter.roles[0]?.name.replace('ROLE_', '')}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Statut',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={getStatusLabel(params.value)}
          color={getStatusColor(params.value)}
          size="small"
          icon={
            params.value === 'PENDING' ? <PendingIcon /> :
            params.value === 'RESOLVED' ? <CheckCircleIcon /> :
            <CancelIcon />
          }
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date du signalement',
      width: 150,
      valueGetter: (params) => new Date(params.value).toLocaleDateString('fr-FR'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 350,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Button
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => handleViewReport(params.row)}
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
                onClick={() => handleResolveReport(params.row.id)}
                sx={{ mr: 1 }}
              >
                Résoudre
              </Button>
              <Button
                size="small"
                color="warning"
                startIcon={<CancelIcon />}
                onClick={() => handleDismissReport(params.row.id)}
                sx={{ mr: 1 }}
              >
                Rejeter
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeletePublication(params.row.publicationId)}
              >
                Supprimer pub.
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
        Gestion des signalements
      </Typography>

      {/* Statistiques rapides */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total signalements
              </Typography>
              <Typography variant="h4">
                {reports.length}
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
                {reports.filter(r => r.status === 'PENDING').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Résolus
              </Typography>
              <Typography variant="h4">
                {reports.filter(r => r.status === 'RESOLVED').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Rejetés
              </Typography>
              <Typography variant="h4">
                {reports.filter(r => r.status === 'DISMISSED').length}
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
              placeholder="Rechercher par motif"
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1 }} />,
              }}
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
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
                <MenuItem value="RESOLVED">Résolu</MenuItem>
                <MenuItem value="DISMISSED">Rejeté</MenuItem>
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

      {/* Table des signalements */}
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={reports}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25]}
          loading={loading}
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Dialog pour voir les détails d'un signalement */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReportIcon />
            Détails du signalement
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6" color="error">
                  Motif: {selectedReport.reason}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2">Description du problème:</Typography>
                <Typography variant="body1" sx={{ mt: 1, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  {selectedReport.description}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">Publication signalée</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {selectedReport.publication.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {selectedReport.publication.description}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Typography variant="body2">
                      <strong>Auteur:</strong> {selectedReport.publication.author.prenom} {selectedReport.publication.author.nom}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Type:</strong> {selectedReport.publication.type}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Prix:</strong> {selectedReport.publication.price} MAD
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle2">Signalé par:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Avatar>
                    {selectedReport.reporter.prenom[0]}{selectedReport.reporter.nom[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="body2">
                      {selectedReport.reporter.prenom} {selectedReport.reporter.nom}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {selectedReport.reporter.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle2">Date du signalement:</Typography>
                <Typography variant="body2">
                  {new Date(selectedReport.createdAt).toLocaleString('fr-FR')}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2">Statut actuel:</Typography>
                <Chip
                  label={getStatusLabel(selectedReport.status)}
                  color={getStatusColor(selectedReport.status)}
                  sx={{ mt: 1 }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Fermer</Button>
          {selectedReport?.status === 'PENDING' && (
            <>
              <Button
                color="success"
                variant="contained"
                onClick={() => {
                  if (selectedReport) {
                    handleResolveReport(selectedReport.id);
                    setOpenDialog(false);
                  }
                }}
              >
                Marquer comme résolu
              </Button>
              <Button
                color="warning"
                variant="outlined"
                onClick={() => {
                  if (selectedReport) {
                    handleDismissReport(selectedReport.id);
                    setOpenDialog(false);
                  }
                }}
              >
                Rejeter le signalement
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => {
                  if (selectedReport) {
                    handleDeletePublication(selectedReport.publicationId);
                    setOpenDialog(false);
                  }
                }}
              >
                Supprimer la publication
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reports;



