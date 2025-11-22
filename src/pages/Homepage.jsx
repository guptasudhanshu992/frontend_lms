import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  CardMedia,
} from '@mui/material';
import {
  TrendingUp,
  School,
  Assessment,
  AccountBalance,
  AutoStories,
  WorkspacePremium,
  ArrowForward,
  People,
} from '@mui/icons-material';

export default function Homepage() {
  const navigate = useNavigate();

  const stats = [
    { value: '50+', label: 'Expert Courses', icon: <School /> },
    { value: '15k+', label: 'Active Students', icon: <People /> },
    { value: '95%', label: 'Success Rate', icon: <TrendingUp /> },
    { value: '500+', label: 'Companies', icon: <AccountBalance /> },
  ];

  const features = [
    {
      icon: <AutoStories sx={{ fontSize: 40 }} />,
      title: 'Industry-Led Curriculum',
      description: 'Learn from content designed by finance professionals at top institutions',
    },
    {
      icon: <Assessment sx={{ fontSize: 40 }} />,
      title: 'Real-World Projects',
      description: 'Build portfolio with financial models and case studies',
    },
    {
      icon: <WorkspacePremium sx={{ fontSize: 40 }} />,
      title: 'Career Support',
      description: 'Get job placement assistance and networking opportunities',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Lifetime Access',
      description: 'Access course materials forever with free updates',
    },
  ];

  const courses = [
    {
      title: 'Financial Modeling',
      level: 'Advanced',
      students: '2,340',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    },
    {
      title: 'Investment Banking',
      level: 'Intermediate',
      students: '1,890',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
    },
    {
      title: 'Portfolio Management',
      level: 'Beginner',
      students: '3,120',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', color: 'white', py: 12 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip
                label="🎓 #1 Finance Learning Platform"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mb: 3 }}
              />
              <Typography variant="h2" fontWeight={700} gutterBottom>
                Master Finance & Build Your Career
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Learn from industry experts. Get certified. Land your dream job in finance.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/courses')}
                  sx={{ bgcolor: 'white', color: 'primary.main', px: 4, '&:hover': { bgcolor: 'grey.100' } }}
                >
                  Explore Courses
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/about')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    '&:hover': { borderColor: 'grey.300', bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Learn More
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600"
                alt="Finance"
                sx={{ width: '100%', borderRadius: 4, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ color: 'primary.main', mb: 1 }}>{stat.icon}</Box>
                  <Typography variant="h3" fontWeight={700} color="primary">
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Why Choose Finance Academy
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Everything you need to succeed in finance
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'translateY(-8px)', boxShadow: 4, borderColor: 'primary.main' },
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Courses */}
      <Box sx={{ bgcolor: 'grey.50', py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Popular Courses
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Start learning from our top-rated courses
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {courses.map((course, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 },
                  }}
                  onClick={() => navigate('/courses')}
                >
                  <CardMedia component="img" height="200" image={course.image} alt={course.title} />
                  <CardContent sx={{ p: 3 }}>
                    <Chip label={course.level} size="small" color="primary" sx={{ mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {course.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                      <People fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {course.students} students
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/courses')}
            >
              View All Courses
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 10 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Ready to Transform Your Career?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of students who have launched their finance careers
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ bgcolor: 'white', color: 'primary.main', px: 5, '&:hover': { bgcolor: 'grey.100' } }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/courses')}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 5,
                '&:hover': { borderColor: 'grey.300', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Browse Courses
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
