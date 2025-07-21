import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Divider
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { CreateUserRequest, UpdateUserRequest, userCRUDService } from '@/api/userCRUDService';

interface UserFormData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  type: 'ETUDIANT' | 'PROFESSEUR' | 'PROFESSIONNEL' | 'ADMINISTRATEUR';
  solde?: number;
  // Champs étudiant
  ecole?: string;
  specialite?: string;
  niveau?: string;
  // Champs professeur
  universite?: string;
  domaineRecherche?: string;
  grade?: string;
  // Champs professionnel
  entreprise?: string;
  secteur?: string;
  poste?: string;
  // Champs administrateur
  niveauAcces?: string;
}

const UserFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<UserFormData>({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    type: 'ETUDIANT',
    solde: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load user data for editing
  useEffect(() => {
    if (isEditing && id) {
      loadUser(id);
    }
  }, [isEditing, id]);

  const loadUser = async (userId: string) => {
    try {
      setLoading(true);
      const user = await userCRUDService.getUserById(userId);
      
      // Determine user type from roles
      let userType: 'ETUDIANT' | 'PROFESSEUR' | 'PROFESSIONNEL' | 'ADMINISTRATEUR' = 'ETUDIANT';
      if (user.roles.includes('ROLE_ADMIN')) userType = 'ADMINISTRATEUR';
      else if (user.roles.includes('ROLE_PROFESSEUR')) userType = 'PROFESSEUR';
      else if (user.roles.includes('ROLE_PROFESSIONNEL')) userType = 'PROFESSIONNEL';

      setFormData({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        password: '', // Don't show existing password
        type: userType,
        solde: user.solde,
        ecole: user.ecole || '',
        specialite: user.specialite || '',
        niveau: user.niveau || '',
        universite: user.universite || '',
        domaineRecherche: user.domaineRecherche || '',
        grade: user.grade || '',
        entreprise: user.entreprise || '',
        secteur: user.secteur || '',
        poste: user.poste || '',
        niveauAcces: user.niveauAcces || ''
      });
    } catch (err) {
      setError('Erreur lors du chargement de l\'utilisateur');
      console.error('Error loading user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'solde' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);

      if (isEditing && id) {
        // Update existing user
        const updateData: UpdateUserRequest = {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          type: formData.type,
          solde: formData.solde
        };

        // Add password only if provided
        if (formData.password.trim()) {
          updateData.password = formData.password;
        }

        // Add type-specific fields
        if (formData.type === 'ETUDIANT') {
          updateData.ecole = formData.ecole;
          updateData.specialite = formData.specialite;
          updateData.niveau = formData.niveau;
        } else if (formData.type === 'PROFESSEUR') {
          updateData.universite = formData.universite;
          updateData.domaineRecherche = formData.domaineRecherche;
          updateData.grade = formData.grade;
        } else if (formData.type === 'PROFESSIONNEL') {
          updateData.entreprise = formData.entreprise;
          updateData.secteur = formData.secteur;
          updateData.poste = formData.poste;
        } else if (formData.type === 'ADMINISTRATEUR') {
          updateData.niveauAcces = formData.niveauAcces;
        }

        await userCRUDService.updateUser(id, updateData);
        setSuccess('Utilisateur mis à jour avec succès');
      } else {
        // Create new user
        const createData: CreateUserRequest = {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          password: formData.password,
          type: formData.type
        };

        // Add type-specific fields
        if (formData.type === 'ETUDIANT') {
          createData.ecole = formData.ecole;
          createData.specialite = formData.specialite;
          createData.niveau = formData.niveau;
        } else if (formData.type === 'PROFESSEUR') {
          createData.universite = formData.universite;
          createData.domaineRecherche = formData.domaineRecherche;
          createData.grade = formData.grade;
        } else if (formData.type === 'PROFESSIONNEL') {
          createData.entreprise = formData.entreprise;
          createData.secteur = formData.secteur;
          createData.poste = formData.poste;
        } else if (formData.type === 'ADMINISTRATEUR') {
          createData.niveauAcces = formData.niveauAcces;
        }

        await userCRUDService.createUser(createData);
        setSuccess('Utilisateur créé avec succès');
      }

      // Redirect after a short delay
      setTimeout(() => {
        if (isEditing) {
          // Redirect to user details page after editing
          navigate(`/users/${id}`);
        } else {
          // Redirect to users list after creating
          navigate('/users');
        }
      }, 1500);

    } catch (err) {
      setError(isEditing ? 'Erreur lors de la mise à jour' : 'Erreur lors de la création');
      console.error('Error saving user:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case 'ETUDIANT':
        return (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="École"
                name="ecole"
                value={formData.ecole || ''}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Spécialité"
                name="specialite"
                value={formData.specialite || ''}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Niveau"
                name="niveau"
                value={formData.niveau || ''}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </>
        );

      case 'PROFESSEUR':
        return (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Université"
                name="universite"
                value={formData.universite || ''}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Domaine de recherche"
                name="domaineRecherche"
                value={formData.domaineRecherche || ''}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Grade"
                name="grade"
                value={formData.grade || ''}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </>
        );

      case 'PROFESSIONNEL':
        return (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Entreprise"
                name="entreprise"
                value={formData.entreprise || ''}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Secteur"
                name="secteur"
                value={formData.secteur || ''}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Poste"
                name="poste"
                value={formData.poste || ''}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </>
        );

      case 'ADMINISTRATEUR':
        return (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Niveau d'accès"
              name="niveauAcces"
              value={formData.niveauAcces || ''}
              onChange={handleInputChange}
              required
            />
          </Grid>
        );

      default:
        return null;
    }
  };

  if (loading && isEditing) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditing ? 'Modifier l\'utilisateur' : 'Créer un utilisateur'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Informations personnelles
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Prénom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={isEditing ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!isEditing}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Type d'utilisateur</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleSelectChange}
                    label="Type d'utilisateur"
                    required
                  >
                    <MenuItem value="ETUDIANT">Étudiant</MenuItem>
                    <MenuItem value="PROFESSEUR">Professeur</MenuItem>
                    <MenuItem value="PROFESSIONNEL">Professionnel</MenuItem>
                    <MenuItem value="ADMINISTRATEUR">Administrateur</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {isEditing && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Solde"
                    name="solde"
                    type="number"
                    value={formData.solde}
                    onChange={handleInputChange}
                    inputProps={{ step: 0.01 }}
                  />
                </Grid>
              )}

              {/* Type-specific fields */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Informations spécifiques
                </Typography>
              </Grid>

              {renderTypeSpecificFields()}

              {/* Submit buttons */}
              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/users')}
                    disabled={loading}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={20} />
                    ) : (
                      isEditing ? 'Mettre à jour' : 'Créer'
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserFormPage;
