import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from '@mui/material';
import {
  School,
  LibraryBooks,
  TrendingUp,
  EmojiEvents,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Enrolled Courses',
      value: '0',
      icon: <School sx={{ fontSize: 40 }} />,
      color: 'primary.main',
    },
    {
      title: 'Completed',
      value: '0',
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      color: 'success.main',
    },
    {
      title: 'In Progress',
      value: '0',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: 'warning.main',
    },
    {
      title: 'Certificates',
      value: '0',
      icon: <LibraryBooks sx={{ fontSize: 40 }} />,
      color: 'info.main',
    },
  ];

  return (
    <>
      <SEO
        title="Dashboard - My Learning"
        description="Track your learning progress, enrolled courses, and achievements"
      />
      <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome back, {user?.full_name || user?.email || 'Student'}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your learning progress and continue your educational journey
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card elevation={2}>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stat.title}
                        </Typography>
                      </Box>
                      <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Card elevation={2}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Start Your Learning Journey
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Explore our courses and begin your path to success
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/courses')}
                >
                  Browse Courses
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
}
