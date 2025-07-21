import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const UsersPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestion des Utilisateurs BINET
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Interface utilisateurs fonctionnelle
        </Typography>
      </Paper>
    </Box>
  );
};

export default UsersPage;
