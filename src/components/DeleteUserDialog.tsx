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
  Chip
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { Utilisateur } from '../types';
import userService from '@/api/userService';

interface DeleteUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: Utilisateur | null;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  open,
  onClose,
  onSuccess,
  user
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await userService.deleteUser(user.id);
      
      onSuccess();
      onClose();
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const userType = user._class?.split('.').pop()?.toLowerCase() || 'inconnu';
  const colorMap = {
    etudiant: 'primary',
    professeur: 'secondary',
    professionnel: 'success',
    administrateur: 'error'
  } as const;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          Confirmer la suppression
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body1" sx={{ mb: 2 }}>
          Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
        </Typography>

        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Utilisateur à supprimer :
          </Typography>
          
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body1" fontWeight="medium">
              {user.nom} {user.prenom}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={userType}
                color={colorMap[userType as keyof typeof colorMap] || 'default'}
                size="small"
                variant="outlined"
              />
              <Typography variant="caption" color="text.secondary">
                Inscrit le {new Date(user.dateInscription).toLocaleDateString('fr-FR')}
              </Typography>
            </Box>

            {user.solde > 0 && (
              <Typography variant="body2" color="warning.main">
                ⚠️ Cet utilisateur a un solde de {user.solde}€
              </Typography>
            )}
          </Box>
        </Box>

        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Attention :</strong> La suppression entraînera également la suppression de :
          </Typography>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Toutes les publications de cet utilisateur</li>
            <li>Tous les achats et transactions</li>
            <li>L'historique des connexions</li>
            <li>Les données personnelles associées</li>
          </ul>
        </Alert>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Supprimer définitivement
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserDialog;
