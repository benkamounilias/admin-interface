import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Edit as EditIcon,
  Download as DownloadIcon 
} from '@mui/icons-material';
import { Utilisateur } from '../types';
import userService from '@/api/userService';

interface BulkActionsDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedUsers: Utilisateur[];
}

const BulkActionsDialog: React.FC<BulkActionsDialogProps> = ({
  open,
  onClose,
  onSuccess,
  selectedUsers
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [confirmAction, setConfirmAction] = useState<string>('');

  const handleBulkAction = async () => {
    if (!selectedAction || selectedUsers.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const userIds = selectedUsers.map(user => user.id);
      
      switch (selectedAction) {
        case 'delete':
          await Promise.all(userIds.map(id => userService.deleteUser(id)));
          break;
        case 'export':
          // Export des utilisateurs sélectionnés
          const blob = await userService.exportUsers('csv');
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `selected_users_${new Date().toISOString().split('T')[0]}.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
          break;
        case 'activate':
          const activateUpdates = userIds.map(id => ({
            id,
            data: { isActive: true }
          }));
          await Promise.all(activateUpdates.map(update => userService.updateUser(update.id, update.data)));
          break;
        case 'deactivate':
          const deactivateUpdates = userIds.map(id => ({
            id,
            data: { isActive: false }
          }));
          await Promise.all(deactivateUpdates.map(update => userService.updateUser(update.id, update.data)));
          break;
      }

      onSuccess();
      onClose();
      setSelectedAction('');
      setConfirmAction('');
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const getActionDetails = () => {
    switch (selectedAction) {
      case 'delete':
        return {
          title: 'Supprimer les utilisateurs sélectionnés',
          description: 'Cette action supprimera définitivement tous les utilisateurs sélectionnés et leurs données associées.',
          color: 'error' as const,
          icon: <DeleteIcon />,
          confirmText: 'SUPPRIMER',
          buttonText: 'Supprimer définitivement'
        };
      case 'export':
        return {
          title: 'Exporter les utilisateurs sélectionnés',
          description: 'Cette action exportera les données des utilisateurs sélectionnés au format CSV.',
          color: 'primary' as const,
          icon: <DownloadIcon />,
          confirmText: 'EXPORTER',
          buttonText: 'Exporter'
        };
      case 'activate':
        return {
          title: 'Activer les utilisateurs sélectionnés',
          description: 'Cette action activera tous les utilisateurs sélectionnés.',
          color: 'success' as const,
          icon: <EditIcon />,
          confirmText: 'ACTIVER',
          buttonText: 'Activer'
        };
      case 'deactivate':
        return {
          title: 'Désactiver les utilisateurs sélectionnés',
          description: 'Cette action désactivera tous les utilisateurs sélectionnés.',
          color: 'warning' as const,
          icon: <EditIcon />,
          confirmText: 'DESACTIVER',
          buttonText: 'Désactiver'
        };
      default:
        return null;
    }
  };

  const actionDetails = getActionDetails();
  const isConfirmationRequired = selectedAction === 'delete';
  const isConfirmed = !isConfirmationRequired || confirmAction === actionDetails?.confirmText;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Actions en masse ({selectedUsers.length} utilisateurs)
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Choisir une action</InputLabel>
          <Select
            value={selectedAction}
            onChange={(e) => {
              setSelectedAction(e.target.value);
              setConfirmAction('');
            }}
            label="Choisir une action"
          >
            <MenuItem value="export">Exporter la sélection</MenuItem>
            <MenuItem value="activate">Activer les utilisateurs</MenuItem>
            <MenuItem value="deactivate">Désactiver les utilisateurs</MenuItem>
            <MenuItem value="delete">Supprimer les utilisateurs</MenuItem>
          </Select>
        </FormControl>

        {actionDetails && (
          <Box sx={{ mb: 3 }}>
            <Alert severity={actionDetails.color === 'error' ? 'error' : 'info'}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {actionDetails.icon}
                <Typography variant="subtitle1" fontWeight="medium">
                  {actionDetails.title}
                </Typography>
              </Box>
              <Typography variant="body2">
                {actionDetails.description}
              </Typography>
            </Alert>

            {isConfirmationRequired && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Pour confirmer cette action destructive, tapez{' '}
                  <strong>{actionDetails.confirmText}</strong> ci-dessous :
                </Typography>
                <input
                  type="text"
                  value={confirmAction}
                  onChange={(e) => setConfirmAction(e.target.value.toUpperCase())}
                  placeholder={actionDetails.confirmText}
                  style={{
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    width: '200px'
                  }}
                />
              </Box>
            )}
          </Box>
        )}

        <Typography variant="h6" gutterBottom>
          Utilisateurs sélectionnés ({selectedUsers.length})
        </Typography>
        
        <Box sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <List dense>
            {selectedUsers.map((user, index) => (
              <React.Fragment key={user.id}>
                <ListItem>
                  <ListItemText
                    primary={`${user.nom} ${user.prenom}`}
                    secondary={`${user.email} • ${user._class?.split('.').pop()}`}
                  />
                </ListItem>
                {index < selectedUsers.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleBulkAction}
          variant="contained"
          color={actionDetails?.color || 'primary'}
          disabled={loading || !selectedAction || !isConfirmed}
          startIcon={loading ? <CircularProgress size={20} /> : actionDetails?.icon}
        >
          {loading ? 'Traitement...' : actionDetails?.buttonText || 'Exécuter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkActionsDialog;
