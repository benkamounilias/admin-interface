import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
  Typography,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { Utilisateur, CreateUtilisateurDTO, UpdateUtilisateurDTO } from '../types';
import userService from '@/api/userService';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: Utilisateur | null;
  mode: 'create' | 'edit';
}

const UserForm: React.FC<UserFormProps> = ({
  open,
  onClose,
  onSuccess,
  user,
  mode
}) => {
  const [formData, setFormData] = useState<CreateUtilisateurDTO>({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    type: 'ETUDIANT',
    roles: ['ROLE_ETUDIANT'],
  });

  const [typeSpecificData, setTypeSpecificData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Réinitialiser le formulaire quand le dialog s'ouvre
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && user) {
        // Fonction asynchrone pour charger les données complètes
        const loadUserData = async () => {
          try {
            setLoading(true);
            
            // Récupérer les données complètes de l'utilisateur
            const completeUser = await userService.getUserById(user.id);
            
            // Déterminer le type en utilisant _class ou une logique de fallback
            let userType = 'ETUDIANT';
            if (completeUser._class) {
              if (completeUser._class.includes('Etudiant')) userType = 'ETUDIANT';
              else if (completeUser._class.includes('Professeur')) userType = 'PROFESSEUR';
              else if (completeUser._class.includes('Professionnel')) userType = 'PROFESSIONNEL';
              else if (completeUser._class.includes('Administrateur')) userType = 'ADMINISTRATEUR';
            } else if (completeUser.type) {
              userType = completeUser.type;
            }

            // Pré-remplir les données de base
            setFormData({
              nom: completeUser.nom || '',
              prenom: completeUser.prenom || '',
              email: completeUser.email || '',
              password: completeUser.password || '', // Afficher le mot de passe du backend
              type: userType as any,
              roles: completeUser.roles?.map((r: any) => typeof r === 'string' ? r : r.name) || [`ROLE_${userType}`],
            });
            
            // Extraire les données spécifiques au type depuis les propriétés de l'utilisateur
            const specificData: Record<string, any> = {};
            const userAny = completeUser as any;
            
            // Récupérer les champs spécifiques directement depuis l'objet utilisateur (héritage)
            // Le backend DTO UpdateUtilisateurDTO contient tous ces champs
            if (userType === 'ETUDIANT') {
              specificData.ecole = userAny.ecole || '';
              specificData.specialite = userAny.specialite || '';
              specificData.niveau = userAny.niveau || '';
            } else if (userType === 'PROFESSEUR') {
              specificData.universite = userAny.universite || '';
              specificData.domaineRecherche = userAny.domaineRecherche || '';
              specificData.grade = userAny.grade || '';
            } else if (userType === 'PROFESSIONNEL') {
              specificData.entreprise = userAny.entreprise || '';
              specificData.secteur = userAny.secteur || '';
              specificData.poste = userAny.poste || '';
            } else if (userType === 'ADMINISTRATEUR') {
              specificData.niveauAcces = userAny.niveauAcces || 'ADMIN';
            }
            
            // Ajouter le champ type pour la compatibilité avec le DTO
            specificData.type = userType;
            
            setTypeSpecificData(specificData);
            
          } catch (error) {
            console.error('❌ Erreur lors du chargement des données utilisateur:', error);
            setError('Impossible de charger les données de l\'utilisateur');
          } finally {
            setLoading(false);
          }
        };
        
        loadUserData();
      } else {
        // Mode création - réinitialiser le formulaire
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          password: '',
          type: 'ETUDIANT',
          roles: ['ROLE_ETUDIANT'],
        });
        setTypeSpecificData({});
      }
      
      setError(null);
      setEmailError(null);
    }
  }, [open, mode, user]);

  // Effet pour surveiller les changements de type d'utilisateur
  useEffect(() => {


  }, [formData.type, typeSpecificData]);

  // Validation email en temps réel
  useEffect(() => {
    // Désactiver la validation email en temps réel en mode modification pour éviter les problèmes CORS
    if (mode === 'edit') {
      setEmailError(null);
      return;
    }
    
    if (formData.email && formData.email.length > 0) {
      const timer = setTimeout(async () => {
        try {
          // TODO: Vérifier si l'email existe déjà
          // const emailExists = await userService.checkEmailExists(formData.email);
          // TODO: Implémenter la vérification d'email
          setEmailError(null);
        } catch (error: any) {
          // En mode création, afficher l'erreur mais ne pas bloquer
          console.warn('Validation email échouée:', error.message);
          setEmailError('Impossible de vérifier l\'email (connexion)');
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setEmailError(null);
    }
  }, [formData.email, mode, user?.id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Mettre à jour les rôles selon le type
    if (field === 'type') {
      setFormData(prev => ({ ...prev, roles: [`ROLE_${value}`] }));
      setTypeSpecificData({}); // Réinitialiser les données spécifiques
    }
  };

  const handleTypeSpecificChange = (field: string, value: string) => {
    setTypeSpecificData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Combiner les données du formulaire avec les données spécifiques au type
      const payload = { ...formData, ...typeSpecificData };
      
      // Logs de diagnostic pour vérifier les données combinées



      
      // Ajouter le champ solde avec une valeur par défaut si non présent
      if (!payload.solde) {
        payload.solde = 0.0;
      }
      
      // En mode modification, optimiser pour le DTO UpdateUtilisateurDTO
      if (mode === 'edit') {
        // Champs spécifiques au type qui doivent être préservés même s'ils sont vides
        const protectedFields = ['ecole', 'specialite', 'niveau', 'universite', 'domaineRecherche', 'grade', 'entreprise', 'secteur', 'poste', 'niveauAcces'];
        
        const cleanPayload: any = {};
        Object.keys(payload).forEach(key => {
          // Préserver les champs spécifiques au type même s'ils sont vides
          if (protectedFields.includes(key)) {
            cleanPayload[key] = payload[key] || '';
          }
          // Pour les autres champs, ne pas envoyer s'ils sont vides
          else if (payload[key] !== '' && payload[key] !== null && payload[key] !== undefined) {
            cleanPayload[key] = payload[key];
          }
        });
        
        // S'assurer que les champs spécifiques au type sont présents selon le type d'utilisateur
        if (payload.type === 'ETUDIANT') {
          cleanPayload.ecole = cleanPayload.ecole || '';
          cleanPayload.specialite = cleanPayload.specialite || '';
          cleanPayload.niveau = cleanPayload.niveau || '';
        } else if (payload.type === 'PROFESSEUR') {
          cleanPayload.universite = cleanPayload.universite || '';
          cleanPayload.domaineRecherche = cleanPayload.domaineRecherche || '';
          cleanPayload.grade = cleanPayload.grade || '';
        } else if (payload.type === 'PROFESSIONNEL') {
          cleanPayload.entreprise = cleanPayload.entreprise || '';
          cleanPayload.secteur = cleanPayload.secteur || '';
          cleanPayload.poste = cleanPayload.poste || '';
        } else if (payload.type === 'ADMINISTRATEUR') {
          cleanPayload.niveauAcces = cleanPayload.niveauAcces || 'ADMIN';
        }
        

        
        const updatePayload: UpdateUtilisateurDTO = cleanPayload as UpdateUtilisateurDTO;
        
        // Si le mot de passe est vide, ne pas l'inclure dans la mise à jour
        if (!updatePayload.password || updatePayload.password.trim() === '') {
          delete updatePayload.password;
        }
        

        await userService.updateUser(user!.id, updatePayload);
        
      } else {
        // En mode création, s'assurer que tous les champs requis sont présents
        const createPayload = { ...payload };
        
        // NE PAS nettoyer les champs spécifiques au type même s'ils sont vides
        // pour permettre au backend de les traiter correctement
        const protectedFields = ['ecole', 'specialite', 'niveau', 'universite', 'domaineRecherche', 'grade', 'entreprise', 'secteur', 'poste', 'niveauAcces'];
        
        // Nettoyer uniquement les champs non-spécifiques qui sont vides
        Object.keys(createPayload).forEach(key => {
          if (!protectedFields.includes(key) && (createPayload[key] === '' || createPayload[key] === null || createPayload[key] === undefined)) {
            delete createPayload[key];
          }
        });
        
        // S'assurer que les champs spécifiques au type sont présents (même vides)
        if (createPayload.type === 'ETUDIANT') {
          createPayload.ecole = createPayload.ecole || '';
          createPayload.specialite = createPayload.specialite || '';
          createPayload.niveau = createPayload.niveau || '';
        } else if (createPayload.type === 'PROFESSEUR') {
          createPayload.universite = createPayload.universite || '';
          createPayload.domaineRecherche = createPayload.domaineRecherche || '';
          createPayload.grade = createPayload.grade || '';
        } else if (createPayload.type === 'PROFESSIONNEL') {
          createPayload.entreprise = createPayload.entreprise || '';
          createPayload.secteur = createPayload.secteur || '';
          createPayload.poste = createPayload.poste || '';
        } else if (createPayload.type === 'ADMINISTRATEUR') {
          createPayload.niveauAcces = createPayload.niveauAcces || 'ADMIN';
        }
        

        await userService.createUser(createPayload);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      let errorMessage = 'Une erreur est survenue';
      
      if (error.message?.includes('Network Error')) {
        errorMessage = 'Erreur de connexion au serveur. Vérifiez votre connexion.';
      } else if (error.message?.includes('email')) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.nom.trim().length >= 2 &&
      formData.prenom.trim().length >= 2 &&
      formData.email.trim().length > 0 &&
      !emailError &&
      (mode === 'edit' || (formData.password && formData.password.length >= 6))
    );
  };

  const renderTypeSpecificFields = () => {
    // Diagnostic pour vérifier le type d'utilisateur actuel


    
    switch (formData.type) {
      case 'ETUDIANT':

        return (
          <>
            <TextField
              fullWidth
              label="École"
              value={typeSpecificData.ecole || ''}
              onChange={(e) => handleTypeSpecificChange('ecole', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Spécialité"
              value={typeSpecificData.specialite || ''}
              onChange={(e) => handleTypeSpecificChange('specialite', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Niveau"
              value={typeSpecificData.niveau || ''}
              onChange={(e) => handleTypeSpecificChange('niveau', e.target.value)}
              margin="normal"
            />
          </>
        );
      case 'PROFESSEUR':

        return (
          <>
            <TextField
              fullWidth
              label="Université"
              value={typeSpecificData.universite || ''}
              onChange={(e) => handleTypeSpecificChange('universite', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Domaine de recherche"
              value={typeSpecificData.domaineRecherche || ''}
              onChange={(e) => handleTypeSpecificChange('domaineRecherche', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Grade"
              value={typeSpecificData.grade || ''}
              onChange={(e) => handleTypeSpecificChange('grade', e.target.value)}
              margin="normal"
            />
          </>
        );
      case 'PROFESSIONNEL':

        return (
          <>
            <TextField
              fullWidth
              label="Entreprise"
              value={typeSpecificData.entreprise || ''}
              onChange={(e) => handleTypeSpecificChange('entreprise', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Secteur"
              value={typeSpecificData.secteur || ''}
              onChange={(e) => handleTypeSpecificChange('secteur', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Poste"
              value={typeSpecificData.poste || ''}
              onChange={(e) => handleTypeSpecificChange('poste', e.target.value)}
              margin="normal"
            />
          </>
        );
      case 'ADMINISTRATEUR':

        return (
          <>
            <TextField
              fullWidth
              label="Niveau d'accès"
              value={typeSpecificData.niveauAcces || 'ADMIN'}
              onChange={(e) => handleTypeSpecificChange('niveauAcces', e.target.value)}
              margin="normal"
            />
          </>
        );
      default:

        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Créer un utilisateur' : 'Modifier l\'utilisateur'}
      </DialogTitle>
      <DialogContent>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <CircularProgress />
          </div>
        )}
        {error && (
          <Alert severity="error" style={{ marginBottom: '20px' }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nom"
              value={formData.nom}
              onChange={(e) => handleInputChange('nom', e.target.value)}
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Prénom"
              value={formData.prenom}
              onChange={(e) => handleInputChange('prenom', e.target.value)}
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              margin="normal"
              required
              error={!!emailError}
              helperText={emailError || ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              margin="normal"
              required={mode === 'create'}
              helperText={mode === 'edit' ? 'Laissez vide pour ne pas changer' : ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Type d'utilisateur"
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              margin="normal"
              required
            >
              <MenuItem value="ETUDIANT">Étudiant</MenuItem>
              <MenuItem value="PROFESSEUR">Professeur</MenuItem>
              <MenuItem value="PROFESSIONNEL">Professionnel</MenuItem>
              <MenuItem value="ADMINISTRATEUR">Administrateur</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Divider style={{ margin: '20px 0' }} />
        
        <Typography variant="h6" gutterBottom>
          Informations spécifiques
        </Typography>
        
        {renderTypeSpecificFields()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={!isFormValid() || loading}
        >
          {loading ? <CircularProgress size={20} /> : (mode === 'create' ? 'Créer' : 'Modifier')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;
