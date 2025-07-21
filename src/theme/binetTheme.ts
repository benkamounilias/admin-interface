import { createTheme } from '@mui/material/styles';

// Palette de couleurs Binet officielle
const binetColors = {
  // Bleu principal existant
  primary: '#56a2c5',
  // Nouveau bleu foncé demandé
  primaryDark: '#0059a8',
  // Couleurs complémentaires organisées
  secondary: '#f50057',
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  // Couleurs neutres
  white: '#ffffff',
  lightGray: '#f8f9fb',
  mediumGray: '#e9ecef',
  darkGray: '#4a4a4a',
  black: '#1a1a1a',
};

const binetTheme = createTheme({
  palette: {
    primary: {
      main: binetColors.primary,
      light: binetColors.primary,
      dark: binetColors.primaryDark,
      contrastText: binetColors.white,
    },
    secondary: {
      main: binetColors.secondary,
      light: '#ff5983',
      dark: '#c51162',
      contrastText: binetColors.white,
    },
    background: {
      default: binetColors.lightGray,
      paper: binetColors.white,
    },
    text: {
      primary: binetColors.black,
      secondary: binetColors.darkGray,
    },
    divider: binetColors.mediumGray,
    success: {
      main: binetColors.success,
    },
    warning: {
      main: binetColors.warning,
    },
    error: {
      main: binetColors.error,
    },
    info: {
      main: binetColors.primary,
    },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#1a1a1a',
      letterSpacing: '-0.01em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#1a1a1a',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#1a1a1a',
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#1a1a1a',
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#1a1a1a',
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      color: '#1a1a1a',
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      color: '#4a4a4a',
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      color: '#4a4a4a',
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '1rem',
      color: '#1a1a1a',
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#4a4a4a',
      letterSpacing: '0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(86, 162, 197, 0.1)',
    '0px 2px 6px rgba(86, 162, 197, 0.15)',
    '0px 4px 12px rgba(86, 162, 197, 0.15)',
    '0px 8px 24px rgba(86, 162, 197, 0.15)',
    '0px 12px 32px rgba(86, 162, 197, 0.15)',
    '0px 16px 40px rgba(86, 162, 197, 0.15)',
    '0px 20px 48px rgba(86, 162, 197, 0.15)',
    '0px 24px 56px rgba(86, 162, 197, 0.15)',
    '0px 28px 64px rgba(86, 162, 197, 0.15)',
    '0px 32px 72px rgba(86, 162, 197, 0.15)',
    '0px 36px 80px rgba(86, 162, 197, 0.15)',
    '0px 40px 88px rgba(86, 162, 197, 0.15)',
    '0px 44px 96px rgba(86, 162, 197, 0.15)',
    '0px 48px 104px rgba(86, 162, 197, 0.15)',
    '0px 52px 112px rgba(86, 162, 197, 0.15)',
    '0px 56px 120px rgba(86, 162, 197, 0.15)',
    '0px 60px 128px rgba(86, 162, 197, 0.15)',
    '0px 64px 136px rgba(86, 162, 197, 0.15)',
    '0px 68px 144px rgba(86, 162, 197, 0.15)',
    '0px 72px 152px rgba(86, 162, 197, 0.15)',
    '0px 76px 160px rgba(86, 162, 197, 0.15)',
    '0px 80px 168px rgba(86, 162, 197, 0.15)',
    '0px 84px 176px rgba(86, 162, 197, 0.15)',
    '0px 88px 184px rgba(86, 162, 197, 0.15)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          padding: '8px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(86, 162, 197, 0.25)',
          },
        },
        containedPrimary: {
          background: binetColors.primary,
          '&:hover': {
            background: binetColors.primary,
            opacity: 0.9,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(86, 162, 197, 0.1)',
          border: '1px solid #e9ecef',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: binetColors.primary,
          boxShadow: '0px 4px 12px rgba(86, 162, 197, 0.15)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid #e9ecef`,
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: `rgba(86, 162, 197, 0.1)`,
            color: binetColors.primary,
            '&:hover': {
              backgroundColor: `rgba(86, 162, 197, 0.15)`,
            },
            '& .MuiListItemIcon-root': {
              color: binetColors.primary,
            },
          },
          '&:hover': {
            backgroundColor: `rgba(86, 162, 197, 0.05)`,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&.Mui-focused fieldset': {
              borderColor: binetColors.primary,
            },
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Export de la palette de couleurs pour utilisation dans les composants
export { binetColors };

export default binetTheme;
