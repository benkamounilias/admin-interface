import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Article,
  Report,
  Category,
  AccountCircle,
  Logout,
  Settings,
  AdminPanelSettings,
  Email,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { binetColors } from '../theme/binetTheme';

const drawerWidth = 240;

const menuItems = [
  { text: 'Tableau de bord', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Utilisateurs', icon: <People />, path: '/users' },
  { text: 'Messages', icon: <Email />, path: '/messages' },
  { text: 'Publications', icon: <Article />, path: '/publications' },
  { text: 'Signalements', icon: <Report />, path: '/reports' },
  { text: 'Catégories', icon: <Category />, path: '/categories' },
];

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/login');
  };

  const drawer = (
    <div>
      <Box sx={{ 
        p: 2, 
        textAlign: 'center',
        borderBottom: '1px solid #e9ecef',
        background: '#0e6e8f',
        color: 'white'
      }}>
        <Typography variant="h6" noWrap component="div" sx={{ 
          fontWeight: 700,
          color: 'white',
          textShadow: '0px 2px 4px rgba(0,0,0,0.2)',
          letterSpacing: '0.1em',
          mb: 1
        }}>
        </Typography>
        <AdminPanelSettings sx={{ 
          color: 'rgba(255,255,255,0.9)',
          fontSize: '1.5rem',
          mb: 0.5
        }} />
        <Typography variant="body2" sx={{ 
          color: 'rgba(255,255,255,0.8)',
          fontWeight: 500
        }}>
          interface d'administration
        </Typography>
      </Box>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: sidebarOpen ? `${drawerWidth}px` : '0px' },
          transition: 'width 0.3s, margin 0.3s',
          backgroundColor: '#393a3aff',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            edge="start"
            onClick={handleSidebarToggle}
            sx={{ mr: 2, display: { xs: 'none', md: 'block' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            flexGrow: 1
          }}>
            <Box
              component="img"
              src="/binet-png.png"
              alt="Binet Logo"
              sx={{
                height: 55,
                width: 55,
                objectFit: 'contain',
                display: { xs: 'none', sm: 'block' },
              }}
            />
            <Typography variant="h6" noWrap component="div" sx={{ 
              fontWeight: 600,
              textShadow: '0px 1px 2px rgba(0,0,0,0.1)'
            }}>
              
            </Typography>
          </Box>
          
          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user?.nom} {user?.prenom}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                <AccountCircle />
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Paramètres
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Déconnexion
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ 
          width: { md: sidebarOpen ? drawerWidth : 0 }, 
          flexShrink: { md: 0 },
          transition: 'width 0.3s',
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: sidebarOpen ? 'block' : 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          mt: '64px',
          backgroundColor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
          transition: 'width 0.3s',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
