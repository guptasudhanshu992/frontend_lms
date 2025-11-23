import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  People,
  School,
  Assignment,
  TrendingUp,
} from '@mui/icons-material';
import AdminLayout from '../../components/admin/AdminLayout';
import useAdminApi from '../../hooks/useAdminApi';
import SEO from '../../components/SEO';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const adminApi = useAdminApi();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminApi.get('/api/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Icon sx={{ fontSize: 48, color, opacity: 0.3 }} />
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SEO 
        title="Admin Dashboard - LMS Management"
        description="Manage courses, users, content, and analytics from your centralized learning management system dashboard. Monitor active sessions, track user engagement, and oversee course administration."
        keywords="admin dashboard, LMS management, course administration, user management, system analytics"
        url="https://lms-platform.com/admin"
      />
      
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}
      >
        Dashboard
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ mb: { xs: 3, sm: 4 } }}
      >
        Overview of your learning management system
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats?.total_users || 0}
            icon={People}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Sessions"
            value={stats?.active_sessions || 0}
            icon={TrendingUp}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Courses"
            value={stats?.total_courses || 6}
            icon={School}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Audit Logs"
            value={stats?.audit_logs || 0}
            icon={Assignment}
            color="warning.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mt: { xs: 1, sm: 2 } }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Activity tracking will be displayed here
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              Quick Actions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Frequently used actions will appear here
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
