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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material';
import {
  Email as EmailIcon,
  Send as SendIcon,
  Group as GroupIcon,
  Preview as PreviewIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { userCRUDService } from '@/api/userCRUDService';
import { emailService, EmailData } from '@/api/emailService';
import { User } from '@/types';
import { binetColors } from '@/theme/binetTheme';

interface EmailMessage {
  id?: string;
  subject: string;
  content: string;
  recipients: string[];
  sentAt?: Date;
  status?: 'draft' | 'sending' | 'sent';
}

// Signature élégante pour tous les emails
const EMAIL_SIGNATURE = `

──────────────────────────────────────
BINET - Interface d'Administration
binet.maroc@gmail.com
www.binet.com
 +212 1 23 45 67 89
 ──────────────────────────────────────
© ${new Date().getFullYear()} BINET - Tous droits réservés
`;

const Messages: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [emailMessage, setEmailMessage] = useState<EmailMessage>({
    subject: '',
    content: '',
    recipients: [],
    status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [recipientType, setRecipientType] = useState<'all' | 'etudiant' | 'professeur' | 'professionnel' | 'administrateur' | 'custom'>('custom');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('🔄 MESSAGES: Chargement des utilisateurs avec service normal...');
      const userData = await userCRUDService.getAllUsers();
      setUsers(userData);
      console.log('✅ MESSAGES: Utilisateurs chargés avec succès:', userData.length);
    } catch (err: any) {
      console.error('❌ MESSAGES: Erreur chargement utilisateurs:', err);
      showNotification(err.message || 'Erreur lors du chargement des utilisateurs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setNotification({ open: true, message, severity });
  };

  const handleRecipientTypeChange = (event: SelectChangeEvent) => {
    const type = event.target.value as typeof recipientType;
    setRecipientType(type);
    
    let selectedEmails: string[] = [];
    
    switch (type) {
      case 'all':
        selectedEmails = users.map(user => user.email);
        break;
      case 'etudiant':
        selectedEmails = users.filter(user => user.roles.includes('ROLE_ETUDIANT')).map(user => user.email);
        break;
      case 'professeur':
        selectedEmails = users.filter(user => user.roles.includes('ROLE_PROFESSEUR')).map(user => user.email);
        break;
      case 'professionnel':
        selectedEmails = users.filter(user => user.roles.includes('ROLE_PROFESSIONNEL')).map(user => user.email);
        break;
      case 'administrateur':
        selectedEmails = users.filter(user => user.roles.includes('ROLE_ADMIN')).map(user => user.email);
        break;
      case 'custom':
        selectedEmails = [];
        break;
    }
    
    setSelectedUsers(selectedEmails);
    setEmailMessage(prev => ({ ...prev, recipients: selectedEmails }));
  };

  const handleUserSelection = (userEmail: string) => {
    const isSelected = selectedUsers.includes(userEmail);
    let newSelection: string[];
    
    if (isSelected) {
      newSelection = selectedUsers.filter(email => email !== userEmail);
    } else {
      newSelection = [...selectedUsers, userEmail];
    }
    
    setSelectedUsers(newSelection);
    setEmailMessage(prev => ({ ...prev, recipients: newSelection }));
    
    // Si on modifie la sélection manuellement, passer en mode custom
    if (recipientType !== 'custom') {
      setRecipientType('custom');
    }
  };

  const handlePreview = () => {
    if (!emailMessage.subject || !emailMessage.content || selectedUsers.length === 0) {
      showNotification('Veuillez remplir tous les champs et sélectionner au moins un destinataire', 'warning');
      return;
    }
    setPreviewOpen(true);
  };

  const handleSendEmail = async () => {
    try {
      setLoading(true);
      setEmailMessage(prev => ({ ...prev, status: 'sending' }));
      
      // Ajouter la signature au contenu du message
      const messageWithSignature = emailMessage.content + EMAIL_SIGNATURE;
      
      // Préparer les données de l'email
      const emailData: EmailData = {
        to: selectedUsers,
        subject: emailMessage.subject,
        content: messageWithSignature,
        from: 'binet.maroc@gmail.com'
      };
      
      // Envoyer l'email via le service réel
      const result = await emailService.sendBulkEmails(emailData, 10);
      
      if (result.success) {
        setEmailMessage({
          subject: '',
          content: '',
          recipients: [],
          status: 'draft'
        });
        setSelectedUsers([]);
        setRecipientType('custom');
        setPreviewOpen(false);
        
        showNotification(result.message, 'success');
        
        // Afficher les échecs s'il y en a
        if (result.failedRecipients && result.failedRecipients.length > 0) {
          setTimeout(() => {
            showNotification(
              `Échecs d'envoi pour: ${result.failedRecipients!.join(', ')}`, 
              'warning'
            );
          }, 2000);
        }
      } else {
        showNotification(`Erreur d'envoi: ${result.message}`, 'error');
        setEmailMessage(prev => ({ ...prev, status: 'draft' }));
      }
      
    } catch (err: any) {
      console.error('Erreur lors de l\'envoi de l\'email:', err);
      showNotification('Erreur lors de l\'envoi de l\'email', 'error');
      setEmailMessage(prev => ({ ...prev, status: 'draft' }));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    // TODO: Implémenter la sauvegarde de brouillon
    showNotification('Brouillon sauvegardé', 'info');
  };

  const handleTestEmailConfig = async () => {
    try {
      setLoading(true);
      const result = await emailService.testEmailConfiguration();
      
      if (result.success) {
        showNotification('✅ Configuration email testée avec succès', 'success');
      } else {
        showNotification(`⚠️ ${result.message}`, 'warning');
      }
    } catch (err: any) {
      showNotification('❌ Erreur lors du test de configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleShowBackendInfo = () => {
    showNotification(
      '📋 Consultez le fichier EMAIL_BACKEND_SETUP.md pour configurer l\'envoi d\'emails réels via binet.maroc@gmail.com', 
      'info'
    );
  };

  const getUserTypeLabel = (user: User) => {
    if (user.roles.includes('ROLE_ADMIN')) return 'Administrateur';
    if (user.roles.includes('ROLE_PROFESSEUR')) return 'Professeur';
    if (user.roles.includes('ROLE_PROFESSIONNEL')) return 'Professionnel';
    if (user.roles.includes('ROLE_ETUDIANT')) return 'Étudiant';
    return 'Utilisateur';
  };

  const getTypeColor = (user: User) => {
    if (user.roles.includes('ROLE_ADMIN')) return 'error';
    if (user.roles.includes('ROLE_PROFESSEUR')) return 'secondary';
    if (user.roles.includes('ROLE_PROFESSIONNEL')) return 'success';
    if (user.roles.includes('ROLE_ETUDIANT')) return 'primary';
    return 'default';
  };

  return (
    <Box sx={{ height: '100%', width: '100%', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <EmailIcon sx={{ color: binetColors.primary }} />
          Messages aux Utilisateurs
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Envoyez des messages personnalisés aux utilisateurs par email
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Formulaire de composition */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SendIcon sx={{ color: binetColors.primary }} />
                Composer un message
              </Typography>

              {/* Info expéditeur */}
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  mb: 3,
                  bgcolor: `${binetColors.primary}08`,
                  border: `1px solid ${binetColors.primary}30`
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ fontSize: 16, color: binetColors.primary }} />
                    <strong>Expéditeur:</strong> binet.maroc@gmail.com
                  </Typography>
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleShowBackendInfo}
                    sx={{ 
                      color: binetColors.primary,
                      textTransform: 'none',
                      fontSize: '0.75rem'
                    }}
                  >
                    ℹ️ Config Backend
                  </Button>
                </Box>
              </Paper>

              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Objet du message"
                  value={emailMessage.subject}
                  onChange={(e) => setEmailMessage(prev => ({ ...prev, subject: e.target.value }))}
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Contenu du message"
                  value={emailMessage.content}
                  onChange={(e) => setEmailMessage(prev => ({ ...prev, content: e.target.value }))}
                  multiline
                  rows={8}
                  variant="outlined"
                  placeholder="Rédigez votre message ici..."
                />

                {/* Aperçu de la signature */}
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'grey.50',
                    border: `1px dashed ${binetColors.primary}40`
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem', color: 'text.secondary' }}>
                    {EMAIL_SIGNATURE}
                  </Typography>
                </Paper>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    startIcon={<PreviewIcon />}
                    onClick={handlePreview}
                    disabled={loading}
                  >
                    Aperçu
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveDraft}
                    disabled={loading}
                  >
                    Sauvegarder
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleTestEmailConfig}
                    disabled={loading}
                    sx={{
                      color: 'orange',
                      borderColor: 'orange',
                      '&:hover': {
                        borderColor: 'orange',
                        backgroundColor: 'rgba(255, 165, 0, 0.1)'
                      }
                    }}
                  >
                    Test Email
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={16} /> : <SendIcon />}
                    onClick={handleSendEmail}
                    disabled={loading || selectedUsers.length === 0 || !emailMessage.subject || !emailMessage.content}
                    sx={{
                      bgcolor: binetColors.primary,
                      '&:hover': { bgcolor: binetColors.primary + 'DD' }
                    }}
                  >
                    {loading ? 'Envoi...' : `Envoyer (${selectedUsers.length})`}
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Sélection des destinataires */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <GroupIcon sx={{ color: binetColors.primary }} />
                Destinataires ({selectedUsers.length})
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Type de destinataires</InputLabel>
                <Select
                  value={recipientType}
                  label="Type de destinataires"
                  onChange={handleRecipientTypeChange}
                >
                  <MenuItem value="custom">Sélection personnalisée</MenuItem>
                  <MenuItem value="all">Tous les utilisateurs</MenuItem>
                  <MenuItem value="etudiant">Étudiants uniquement</MenuItem>
                  <MenuItem value="professeur">Professeurs uniquement</MenuItem>
                  <MenuItem value="professionnel">Professionnels uniquement</MenuItem>
                  <MenuItem value="administrateur">Administrateurs uniquement</MenuItem>
                </Select>
              </FormControl>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Paper variant="outlined" sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <List dense>
                    {users.map((user) => (
                      <ListItem key={user.id} button onClick={() => handleUserSelection(user.email)}>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={selectedUsers.includes(user.email)}
                            onChange={() => handleUserSelection(user.email)}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${user.prenom} ${user.nom}`}
                          secondary={
                            <Stack spacing={0.5}>
                              <Typography variant="body2" color="text.secondary">
                                {user.email}
                              </Typography>
                              <Chip
                                label={getUserTypeLabel(user)}
                                size="small"
                                color={getTypeColor(user) as any}
                                variant="outlined"
                              />
                            </Stack>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog de prévisualisation */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Aperçu du message
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Destinataires:</Typography>
            <Typography variant="body2">{selectedUsers.join(', ')}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Objet:</Typography>
            <Typography variant="h6">{emailMessage.subject}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Contenu:</Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {emailMessage.content + EMAIL_SIGNATURE}
              </Typography>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>
            Modifier
          </Button>
          <Button 
            onClick={handleSendEmail} 
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} /> : <SendIcon />}
            disabled={loading}
            sx={{
              bgcolor: binetColors.primary,
              '&:hover': { bgcolor: binetColors.primary + 'DD' }
            }}
          >
            {loading ? 'Envoi...' : 'Envoyer maintenant'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Messages;
