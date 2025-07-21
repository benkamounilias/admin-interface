import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  Fade,
  Grow,
} from '@mui/material';
import {
  People,
  Article,
  TrendingUp,
  AttachMoney,
  PendingActions,
  MoreVert,
  Analytics,
  NotificationsActive,
  Warning,
  PieChart as PieChartIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { DashboardStats } from '../types';
import { userCRUDService, User } from '../api/userCRUDService';
import { binetColors } from '../theme/binetTheme';

// Données de démonstration (à remplacer par des appels API réels)
const mockStats: DashboardStats = {
  totalUsers: 1250,
  totalPublications: 342,
  totalSales: 89,
  totalRevenue: 15450,
  pendingPublications: 23,
  pendingReports: 7,
  usersByRole: {
    students: 892,
    professors: 245,
    professionals: 113,
  },
  publicationsByType: {
    articles: 156,
    memoirs: 89,
    projects: 67,
    reports: 30,
  },
  recentActivity: {
    newUsers: 15,
    newPublications: 8,
    newSales: 12,
  },
};

const mockChartData = [
  { name: 'Jan', users: 65, publications: 28, sales: 12 },
  { name: 'Fév', users: 89, publications: 34, sales: 18 },
  { name: 'Mar', users: 123, publications: 42, sales: 25 },
  { name: 'Avr', users: 156, publications: 38, sales: 22 },
  { name: 'Mai', users: 178, publications: 45, sales: 28 },
  { name: 'Jun', users: 201, publications: 52, sales: 31 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  subtitle?: string;
  delay?: number;
}

const ModernStatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  trend, 
  subtitle, 
  delay = 0 
}) => (
  <Grow in timeout={500 + delay}>
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
        borderRadius: 1,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          border: `1px solid ${color}40`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: '#0e6e8f',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Avatar 
            sx={{ 
              bgcolor: `${color}20`, 
              color: color,
              width: 56,
              height: 56,
              '& .MuiSvgIcon-root': {
                fontSize: '1.8rem'
              }
            }}
          >
            {icon}
          </Avatar>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <MoreVert />
          </IconButton>
        </Box>
        
        <Typography 
          variant="h3" 
          component="div" 
          sx={{ 
            fontWeight: 700,
            background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 0.5
          }}
        >
          {value}
        </Typography>
        
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 600,
            mb: subtitle ? 0.5 : 1
          }}
        >
          {title}
        </Typography>
        
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {subtitle}
          </Typography>
        )}
        
        {trend && (
          <Box display="flex" alignItems="center" gap={1}>
            <Chip 
              icon={<TrendingUp />}
              label={`+${trend}%`}
              size="small"
              sx={{ 
                bgcolor: '#4caf5020',
                color: '#4caf50',
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: '#4caf50'
                }
              }}
            />
            <Typography variant="caption" color="text.secondary">
              ce mois
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  </Grow>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [realUsers, setRealUsers] = useState<User[]>([]);

  // Function to calculate real statistics from users data
  const calculateRealStats = (users: User[]): DashboardStats => {
    const totalUsers = users.length;
    
    // Calculate users by role
    const usersByRole = {
      students: users.filter(user => user.roles.includes('ROLE_ETUDIANT')).length,
      professors: users.filter(user => user.roles.includes('ROLE_PROFESSEUR')).length,
      professionals: users.filter(user => user.roles.includes('ROLE_PROFESSIONNEL')).length,
    };

    // Calculate total solde and average
    const totalSolde = users.reduce((sum, user) => sum + user.solde, 0);
    
    // Mock other data for now (can be replaced with real API calls later)
    return {
      totalUsers,
      totalPublications: 342, // TODO: Replace with real data when publication API is available
      totalSales: 89, // TODO: Replace with real data
      totalRevenue: totalSolde, // Use real total solde as revenue
      pendingPublications: 23, // TODO: Replace with real data
      pendingReports: 7, // TODO: Replace with real data
      usersByRole,
      publicationsByType: {
        articles: 156,
        memoirs: 89,
        projects: 67,
        reports: 30,
      },
      recentActivity: {
        newUsers: Math.max(0, Math.floor(totalUsers * 0.012)), // Simulate 1.2% growth
        newPublications: 8,
        newSales: 12,
      },
    };
  };

  const calculateUserTrend = (): number => {
    // For now, simulate monthly growth based on current data
    // TODO: Implement real historical data comparison when user creation dates are available
    const baseGrowthRate = Math.floor(Math.random() * 15) + 5; // Random between 5-19%
    return Math.min(baseGrowthRate, 25); // Cap at 25%
  };

  useEffect(() => {
    const fetchRealStats = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch real users data
        const usersData = await userCRUDService.getAllUsers();
        setRealUsers(usersData);
        
        // Calculate real statistics
        const realStats = calculateRealStats(usersData);
        setStats(realStats);
        
      } catch (err: any) {
        console.error('Error fetching real stats:', err);
        
        // Check if it's an authentication error
        if (err.message && err.message.includes('authentification')) {
          setError('❌ Erreur d\'authentification: Veuillez vous reconnecter');
        } else if (err.response?.status === 400) {
          setError('❌ Erreur d\'authentification: Token invalide. Veuillez vous reconnecter');
        } else if (err.response?.status === 401) {
          setError('❌ Accès non autorisé: Veuillez vous reconnecter');
        } else {
          setError('Erreur lors du chargement des statistiques');
        }
        
        // Fallback to mock data if API fails
        setStats(mockStats);
      } finally {
        setLoading(false);
      }
    };

    fetchRealStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!stats) return null;

  // Calculate real user role data from actual users
  const userRoleData = [
    { 
      name: 'Étudiants', 
      value: realUsers.filter(user => user.roles.includes('ROLE_ETUDIANT')).length,
      color: '#0088FE' 
    },
    { 
      name: 'Professeurs', 
      value: realUsers.filter(user => user.roles.includes('ROLE_PROFESSEUR')).length,
      color: '#00C49F' 
    },
    { 
      name: 'Professionnels', 
      value: realUsers.filter(user => user.roles.includes('ROLE_PROFESSIONNEL')).length,
      color: '#FFBB28' 
    },
    { 
      name: 'Administrateurs', 
      value: realUsers.filter(user => user.roles.includes('ROLE_ADMIN')).length,
      color: '#FF8042' 
    },
  ].filter(item => item.value > 0); // Only show categories that have users

  const publicationTypeData = [
    { name: 'Articles', value: stats.publicationsByType.articles },
    { name: 'Mémoires', value: stats.publicationsByType.memoirs },
    { name: 'Projets', value: stats.publicationsByType.projects },
    { name: 'Rapports', value: stats.publicationsByType.reports },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header moderne */}
      <Fade in timeout={500}>
        <Box mb={4}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 800,
              color: '#0e6e8f',
              mb: 1
            }}
          >
            Tableau de Bord
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            Vue d'ensemble de votre plateforme
          </Typography>
        </Box>
      </Fade>

      {/* Cartes de statistiques principales - Design moderne */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <ModernStatCard
            title="Utilisateurs Actifs"
            value={stats.totalUsers.toLocaleString()}
            subtitle="Utilisateurs enregistrés"
            icon={<People />}
            color="#0e6e8f"
            trend={calculateUserTrend()}
            delay={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <ModernStatCard
            title="Revenus Total"
            value={`${stats.totalRevenue.toLocaleString()} DH`}
            subtitle="Solde total réel"
            icon={<AttachMoney />}
            color="#2e7d32"
            trend={8}
            delay={100}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <ModernStatCard
            title="Publications"
            value={stats.totalPublications}
            subtitle="Contenu publié"
            icon={<Article />}
            color={binetColors.primary}
            trend={12}
            delay={200}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <ModernStatCard
            title="En Attente"
            value={stats.pendingPublications}
            subtitle="Actions requises"
            icon={<PendingActions />}
            color="#ff6b35"
            delay={300}
          />
        </Grid>
      </Grid>

      {/* Section d'informations détaillées sur les utilisateurs réels - Design moderne */}
      <Grow in timeout={800}>
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12}>
            <Card 
              sx={{ 
                borderRadius: 1,
                background: 'linear-gradient(135deg, rgba(86, 162, 197, 0.03) 0%, rgba(0, 89, 168, 0.08) 100%)',
                border: '1px solid rgba(86, 162, 197, 0.1)',
                backdropFilter: 'blur(10px)',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: '#0e6e8f',
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar 
                    sx={{ 
                      bgcolor: `#0e6e8f15`, 
                      color: "#0e6e8f",
                      width: 48,
                      height: 48 
                    }}
                  >
                    <Analytics />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                      Analyse Détaillée des Utilisateurs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Données en temps réel de votre plateforme
                    </Typography>
                  </Box>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center" sx={{ p: 2 }}>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 800,
                          color: '#0e6e8f',
                          mb: 1
                        }}
                      >
                        {realUsers.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        Utilisateurs Enregistrés
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={100} 
                        sx={{ 
                          mt: 1, 
                          bgcolor: `#0e6e8f20`,
                          '& .MuiLinearProgress-bar': {
                            bgcolor: "#0e6e8f"
                          }
                        }} 
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center" sx={{ p: 2 }}>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 800,
                          color: '#4caf50',
                          mb: 1
                        }}
                      >
                        {realUsers.filter(user => user.roles.includes('ROLE_ETUDIANT')).length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        Étudiants
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(realUsers.filter(user => user.roles.includes('ROLE_ETUDIANT')).length / realUsers.length) * 100} 
                        sx={{ 
                          mt: 1, 
                          bgcolor: '#4caf5020',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#4caf50'
                          }
                        }} 
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center" sx={{ p: 2 }}>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 800,
                          color: binetColors.primary,
                          mb: 1
                        }}
                      >
                        {realUsers.filter(user => user.roles.includes('ROLE_PROFESSEUR')).length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        Professeurs
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(realUsers.filter(user => user.roles.includes('ROLE_PROFESSEUR')).length / realUsers.length) * 100} 
                        sx={{ 
                          mt: 1, 
                          bgcolor: `${binetColors.primary}20`,
                          '& .MuiLinearProgress-bar': {
                            bgcolor: binetColors.primary
                          }
                        }} 
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center" sx={{ p: 2 }}>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 800,
                          color: '#ff9800',
                          mb: 1
                        }}
                      >
                        {realUsers.reduce((sum, user) => sum + user.solde, 0).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        Solde Total (DH)
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={75} 
                        sx={{ 
                          mt: 1, 
                          bgcolor: '#ff980020',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#ff9800'
                          }
                        }} 
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grow>

      {/* Graphiques modernes avec animations */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        <Grid item xs={12} lg={8}>
          <Fade in timeout={1000}>
            <Card 
              sx={{ 
                borderRadius: 1,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(86, 162, 197, 0.05) 100%)',
                border: '1px solid rgba(86, 162, 197, 0.15)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  border: `1px solid ${binetColors.primary}30`,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: '#0e6e8f',
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={2} mb={4}>
                  <Avatar 
                    sx={{ 
                      bgcolor: '#0e6e8f15', 
                      color: '#0e6e8f',
                      width: 48,
                      height: 48 
                    }}
                  >
                    <TrendingUp />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                      Évolution Mensuelle
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tendances et croissance de la plateforme
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ position: 'relative', bgcolor: 'rgba(255, 255, 255, 0.8)', borderRadius: 1, p: 2 }}>
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={mockChartData}>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="rgba(0, 0, 0, 0.1)"
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#666' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#666' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: `1px solid ${binetColors.primary}30`,
                          borderRadius: '12px',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{
                          paddingTop: '20px',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      />
                      <Line 
                        type="monotone"
                        dataKey="users"
                        stroke={binetColors.primary}
                        strokeWidth={3}
                        dot={{
                          stroke: '#fff',
                          strokeWidth: 2,
                          r: 4,
                          fill: binetColors.primary,
                        }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone"
                        dataKey="publications"
                        stroke={binetColors.secondary}
                        strokeWidth={3}
                        dot={{
                          stroke: '#fff',
                          strokeWidth: 2,
                          r: 4,
                          fill: binetColors.secondary,
                        }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone"
                        dataKey="sales"
                        stroke="#ff9800"
                        strokeWidth={3}
                        dot={{
                          stroke: '#fff',
                          strokeWidth: 2,
                          r: 4,
                          fill: '#ff9800',
                        }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Fade in timeout={1200}>
            <Card 
              sx={{ 
                borderRadius: 1,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(86, 162, 197, 0.05) 100%)',
                border: '1px solid rgba(86, 162, 197, 0.15)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  border: `1px solid ${binetColors.primary}30`,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: '#0e6e8f',
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={2} mb={4}>
                  <Avatar 
                    sx={{ 
                      bgcolor: '#0e6e8f15', 
                      color: '#0e6e8f',
                      width: 48,
                      height: 48 
                    }}
                  >
                    <PieChartIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                      Répartition des Publications
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Types de publications sur la plateforme
                    </Typography>
                  </Box>
                </Box>
                
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: `1px solid ${binetColors.primary}30`,
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{
                        paddingTop: '10px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    />
                    <Pie 
                      data={publicationTypeData} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      innerRadius="60%" 
                      outerRadius="80%" 
                      fill="#8884d8"
                      stroke="none"
                    >
                      {publicationTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
