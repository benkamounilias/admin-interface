import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Fab,
  Pagination,
  TableFooter,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Slider,
  Stack,
  Grid,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  DeleteSweep as DeleteSweepIcon,
  SelectAll as SelectAllIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { userCRUDService } from '@/api/userCRUDService';
import { User } from '@/types';

// Helper function to get user type icon
const getUserTypeIcon = (roles: string[]) => {
  if (roles.includes('ROLE_ADMIN')) return <AdminIcon />;
  if (roles.includes('ROLE_PROFESSEUR')) return <SchoolIcon />;
  if (roles.includes('ROLE_PROFESSIONNEL')) return <BusinessIcon />;
  return <PersonIcon />;
};

// Helper function to get user type color
const getUserTypeColor = (roles: string[]) => {
  if (roles.includes('ROLE_ADMIN')) return 'error';
  if (roles.includes('ROLE_PROFESSEUR')) return 'primary';
  if (roles.includes('ROLE_PROFESSIONNEL')) return 'secondary';
  return 'default';
};

// Helper function to get user type label
const getUserTypeLabel = (roles: string[]) => {
  if (roles.includes('ROLE_ADMIN')) return 'Administrateur';
  if (roles.includes('ROLE_PROFESSEUR')) return 'Professeur';
  if (roles.includes('ROLE_PROFESSIONNEL')) return 'Professionnel';
  return 'Étudiant';
};

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Pagination states
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilters, setTypeFilters] = useState({
    ETUDIANT: false,
    PROFESSEUR: false,
    PROFESSIONNEL: false,
    ADMINISTRATEUR: false
  });
  const [soldeRange, setSoldeRange] = useState<number[]>([0, 10000]);
  const [minSolde, setMinSolde] = useState(0);
  const [maxSolde, setMaxSolde] = useState(10000);
  
  // Selection states
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [bulkActionsAnchor, setBulkActionsAnchor] = useState<null | HTMLElement>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  
  const navigate = useNavigate();

  // Load users on component mount and when filters change
  useEffect(() => {
    loadUsers();
  }, [page, rowsPerPage, searchTerm, typeFilters, soldeRange]);

  // Update solde range when all users are loaded
  useEffect(() => {
    if (allUsers.length > 0) {
      const soldes = allUsers.map(user => user.solde);
      const min = Math.min(...soldes);
      const max = Math.max(...soldes);
      setMinSolde(min);
      setMaxSolde(max);
      setSoldeRange([min, max]);
    }
  }, [allUsers]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Only fetch from API if allUsers is empty
      if (allUsers.length === 0) {
        const usersData = await userCRUDService.getAllUsers();
        setAllUsers(usersData);
        return;
      }
      
      // Apply filters
      let filteredUsers = allUsers;
      
      // Search filter
      if (searchTerm) {
        filteredUsers = filteredUsers.filter(user =>
          user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Type filters
      const activeTypeFilters = Object.entries(typeFilters)
        .filter(([_, active]) => active)
        .map(([type, _]) => type);
      
      if (activeTypeFilters.length > 0) {
        filteredUsers = filteredUsers.filter(user =>
          activeTypeFilters.some(type => user.roles.includes(`ROLE_${type}`))
        );
      }
      
      // Solde range filter
      filteredUsers = filteredUsers.filter(user =>
        user.solde >= soldeRange[0] && user.solde <= soldeRange[1]
      );
      
      // Apply pagination to filtered results
      const startIndex = (page - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      setUsers(paginatedUsers);
      setTotalUsers(filteredUsers.length);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    const initialLoad = async () => {
      try {
        setLoading(true);
        const usersData = await userCRUDService.getAllUsers();
        setAllUsers(usersData);
      } catch (err) {
        setError('Erreur lors du chargement des utilisateurs');
        console.error('Error loading users:', err);
      } finally {
        setLoading(false);
      }
    };
    
    initialLoad();
  }, []);

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      setDeleting(true);
      await userCRUDService.deleteUser(userToDelete.id);
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (err) {
      setError('Erreur lors de la suppression de l\'utilisateur');
      console.error('Error deleting user:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = (user: User) => {
    navigate(`/users/edit/${user.id}`);
  };

  const handleViewDetails = (user: User) => {
    navigate(`/users/${user.id}`);
  };

  const handleCreateClick = () => {
    navigate('/users/create');
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
    if (selectionMode) {
      setSelectedUsers([]); // Clear selection when changing pages
      setSelectAll(false);
    }
  };

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    if (selectionMode) {
      setSelectedUsers([]); // Clear selection when changing rows per page
      setSelectAll(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleTypeFilterChange = (type: string) => {
    setTypeFilters(prev => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev]
    }));
    setPage(1);
  };

  const handleSoldeRangeChange = (event: Event, newValue: number | number[]) => {
    setSoldeRange(newValue as number[]);
    setPage(1);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setTypeFilters({
      ETUDIANT: false,
      PROFESSEUR: false,
      PROFESSIONNEL: false,
      ADMINISTRATEUR: false
    });
    setSoldeRange([minSolde, maxSolde]);
    setPage(1);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (Object.values(typeFilters).some(active => active)) count++;
    if (soldeRange[0] !== minSolde || soldeRange[1] !== maxSolde) count++;
    return count;
  };

  const getFilteredStats = () => {
    let filteredUsers = allUsers;
    
    // Apply same filters as in loadUsers
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(user =>
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    const activeTypeFilters = Object.entries(typeFilters)
      .filter(([_, active]) => active)
      .map(([type, _]) => type);
    
    if (activeTypeFilters.length > 0) {
      filteredUsers = filteredUsers.filter(user =>
        activeTypeFilters.some(type => user.roles.includes(`ROLE_${type}`))
      );
    }
    
    filteredUsers = filteredUsers.filter(user =>
      user.solde >= soldeRange[0] && user.solde <= soldeRange[1]
    );

    const totalSolde = filteredUsers.reduce((sum, user) => sum + user.solde, 0);
    const avgSolde = filteredUsers.length > 0 ? totalSolde / filteredUsers.length : 0;
    
    return {
      total: filteredUsers.length,
      totalSolde,
      avgSolde
    };
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
      setSelectAll(false);
    } else {
      setSelectedUsers(users.map(user => user.id));
      setSelectAll(true);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        const newSelected = prev.filter(id => id !== userId);
        setSelectAll(false);
        return newSelected;
      } else {
        const newSelected = [...prev, userId];
        setSelectAll(newSelected.length === users.length);
        return newSelected;
      }
    });
  };

  const handleBulkActionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setBulkActionsAnchor(event.currentTarget);
  };

  const handleBulkActionsClose = () => {
    setBulkActionsAnchor(null);
  };

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
    handleBulkActionsClose();
  };

  const handleBulkDeleteConfirm = async () => {
    try {
      setBulkDeleting(true);
      
      // Delete all selected users
      for (const userId of selectedUsers) {
        await userCRUDService.deleteUser(userId);
      }
      
      // Remove deleted users from the list
      setUsers(users.filter(user => !selectedUsers.includes(user.id)));
      setAllUsers(allUsers.filter(user => !selectedUsers.includes(user.id)));
      
      // Clear selection
      setSelectedUsers([]);
      setSelectAll(false);
      setBulkDeleteDialogOpen(false);
      
      // Reload to update counts
      loadUsers();
    } catch (err) {
      setError('Erreur lors de la suppression des utilisateurs');
      console.error('Error deleting users:', err);
    } finally {
      setBulkDeleting(false);
    }
  };

  const clearSelection = () => {
    setSelectedUsers([]);
    setSelectAll(false);
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      // Exiting selection mode, clear all selections
      setSelectedUsers([]);
      setSelectAll(false);
    }
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedUsers([]);
    setSelectAll(false);
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gestion des Utilisateurs
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: '300px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
            color={getActiveFiltersCount() > 0 ? 'primary' : 'inherit'}
          >
            Filtres {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
          </Button>
          <Button
            variant={selectionMode ? "contained" : "outlined"}
            startIcon={<SelectAllIcon />}
            onClick={toggleSelectionMode}
            color={selectionMode ? 'secondary' : 'inherit'}
          >
            {selectionMode ? 'Annuler sélection' : 'Sélectionner'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            color="primary"
          >
            Ajouter un utilisateur
          </Button>
        </Box>
      </Box>

      {/* Filters Panel */}
      {showFilters && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Filtres</Typography>
              <Button
                size="small"
                onClick={clearAllFilters}
                disabled={getActiveFiltersCount() === 0}
              >
                Effacer tous les filtres
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {/* Type Filter */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Type d'utilisateur
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={typeFilters.ETUDIANT}
                        onChange={() => handleTypeFilterChange('ETUDIANT')}
                      />
                    }
                    label="Étudiant"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={typeFilters.PROFESSEUR}
                        onChange={() => handleTypeFilterChange('PROFESSEUR')}
                      />
                    }
                    label="Professeur"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={typeFilters.PROFESSIONNEL}
                        onChange={() => handleTypeFilterChange('PROFESSIONNEL')}
                      />
                    }
                    label="Professionnel"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={typeFilters.ADMINISTRATEUR}
                        onChange={() => handleTypeFilterChange('ADMINISTRATEUR')}
                      />
                    }
                    label="Administrateur"
                  />
                </FormGroup>
              </Grid>

              {/* Solde Range Filter */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Plage de solde
                </Typography>
                <Box sx={{ px: 2, py: 1 }}>
                  <Slider
                    value={soldeRange}
                    onChange={handleSoldeRangeChange}
                    valueLabelDisplay="auto"
                    min={minSolde}
                    max={maxSolde}
                    step={10}
                    valueLabelFormat={(value) => `${value}DH`}
                  />
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Typography variant="caption">
                      {soldeRange[0]}DH
                    </Typography>
                    <Typography variant="caption">
                      {soldeRange[1]}DH
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Summary */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Résumé des filtres
                </Typography>
                <Stack spacing={1}>
                  {searchTerm && (
                    <Chip
                      label={`Recherche: "${searchTerm}"`}
                      size="small"
                      onDelete={() => setSearchTerm('')}
                    />
                  )}
                  {Object.entries(typeFilters).filter(([_, active]) => active).map(([type, _]) => (
                    <Chip
                      key={type}
                      label={`Type: ${type.charAt(0) + type.slice(1).toLowerCase()}`}
                      size="small"
                      onDelete={() => handleTypeFilterChange(type)}
                    />
                  ))}
                  {(soldeRange[0] !== minSolde || soldeRange[1] !== maxSolde) && (
                    <Chip
                      label={`Solde: ${soldeRange[0]}DH - ${soldeRange[1]}DH`}
                      size="small"
                      onDelete={() => setSoldeRange([minSolde, maxSolde])}
                    />
                  )}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          {/* Bulk Actions Bar */}
          {selectionMode && (
            <Card sx={{ mb: 2, bgcolor: selectedUsers.length > 0 ? 'primary.50' : 'grey.50' }}>
              <CardContent sx={{ py: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" color={selectedUsers.length > 0 ? 'primary' : 'text.secondary'}>
                    {selectedUsers.length === 0 
                      ? 'Mode sélection activé - Cliquez sur les cases pour sélectionner les utilisateurs'
                      : `${selectedUsers.length} utilisateur${selectedUsers.length > 1 ? 's' : ''} sélectionné${selectedUsers.length > 1 ? 's' : ''}`
                    }
                  </Typography>
                  <Box display="flex" gap={1}>
                    {selectedUsers.length > 0 && (
                      <Button
                        variant="outlined"
                        startIcon={<MoreVertIcon />}
                        onClick={handleBulkActionsClick}
                        size="small"
                      >
                        Actions
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      onClick={exitSelectionMode}
                      size="small"
                    >
                      Sortir du mode sélection
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Pagination Controls */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" gap={3}>
              <Typography variant="body2" color="text.secondary">
                {totalUsers === 0 ? 'Aucun utilisateur' : 
                  `Affichage ${((page - 1) * rowsPerPage) + 1} à ${Math.min(page * rowsPerPage, totalUsers)} sur ${totalUsers} utilisateur${totalUsers > 1 ? 's' : ''}`
                }
              </Typography>
              {getActiveFiltersCount() > 0 && (
                <Box display="flex" gap={2}>
                  <Typography variant="body2" color="primary">
                    Solde total: {getFilteredStats().totalSolde.toFixed(2)}DH
                  </Typography>
                  <Typography variant="body2" color="primary">
                    Solde moyen: {getFilteredStats().avgSolde.toFixed(2)}DH
                  </Typography>
                </Box>
              )}
            </Box>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Lignes par page</InputLabel>
              <Select
                value={rowsPerPage.toString()}
                onChange={(e) => handleRowsPerPageChange(e as any)}
                label="Lignes par page"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {selectionMode && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                        checked={selectAll && users.length > 0}
                        onChange={handleSelectAll}
                        inputProps={{ 'aria-label': 'select all users' }}
                      />
                    </TableCell>
                  )}
                  <TableCell>Nom</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Solde</TableCell>
                  <TableCell>Informations spécifiques</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={selectionMode ? 7 : 6} align="center">
                      <Typography variant="body1" color="text.secondary">
                        Aucun utilisateur trouvé
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow 
                      key={user.id} 
                      hover
                      selected={selectionMode && selectedUsers.includes(user.id)}
                    >
                      {selectionMode && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                            inputProps={{ 'aria-labelledby': `user-${user.id}` }}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {getUserTypeIcon(user.roles)}
                          <Box ml={1}>
                            <Typography variant="body1" id={`user-${user.id}`}>
                              {user.nom} {user.prenom}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={getUserTypeLabel(user.roles)}
                          color={getUserTypeColor(user.roles) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{user.solde.toFixed(2)} DH</TableCell>
                      <TableCell>
                        <Box>
                          {user.roles.includes('ROLE_ETUDIANT') && (
                            <Typography variant="body2" color="text.secondary">
                              {user.ecole} - {user.niveau}
                            </Typography>
                          )}
                          {user.roles.includes('ROLE_PROFESSEUR') && (
                            <Typography variant="body2" color="text.secondary">
                              {user.universite} - {user.grade}
                            </Typography>
                          )}
                          {user.roles.includes('ROLE_PROFESSIONNEL') && (
                            <Typography variant="body2" color="text.secondary">
                              {user.entreprise} - {user.poste}
                            </Typography>
                          )}
                          {user.roles.includes('ROLE_ADMIN') && (
                            <Typography variant="body2" color="text.secondary">
                              Niveau: {user.niveauAcces}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => handleViewDetails(user)}
                          color="info"
                          size="small"
                          title="Voir détails"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditClick(user)}
                          color="primary"
                          size="small"
                          title="Modifier"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(user)}
                          color="error"
                          size="small"
                          title="Supprimer"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={selectionMode ? 7 : 6}>
                    {totalUsers > rowsPerPage && (
                      <Box display="flex" justifyContent="center" alignItems="center" py={2}>
                        <Pagination
                          count={Math.ceil(totalUsers / rowsPerPage)}
                          page={page}
                          onChange={handlePageChange}
                          color="primary"
                          size="large"
                          showFirstButton
                          showLastButton
                        />
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleCreateClick}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' }
        }}
      >
        <AddIcon />
      </Fab>

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkActionsAnchor}
        open={Boolean(bulkActionsAnchor)}
        onClose={handleBulkActionsClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleBulkDelete} disabled={selectedUsers.length === 0}>
          <ListItemIcon>
            <DeleteSweepIcon color="error" />
          </ListItemIcon>
          <ListItemText>
            Supprimer les utilisateurs sélectionnés
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirmer la suppression en lot
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer{' '}
            <strong>{selectedUsers.length}</strong> utilisateur{selectedUsers.length > 1 ? 's' : ''} ?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setBulkDeleteDialogOpen(false)}
            disabled={bulkDeleting}
          >
            Annuler
          </Button>
          <Button
            onClick={handleBulkDeleteConfirm}
            color="error"
            variant="contained"
            disabled={bulkDeleting}
          >
            {bulkDeleting ? (
              <CircularProgress size={20} />
            ) : (
              `Supprimer ${selectedUsers.length} utilisateur${selectedUsers.length > 1 ? 's' : ''}`
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
            <strong>{userToDelete?.nom} {userToDelete?.prenom}</strong> ?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
          >
            Annuler
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={20} /> : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersList;
