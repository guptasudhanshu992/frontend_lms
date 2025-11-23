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
import SEO from '../components/SEO';

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
      <SEO 
        title="Master Finance & Professional Development"
        description="Transform your career with our comprehensive learning management system. Access 50+ expert-led courses in finance, investment banking, financial modeling, and portfolio management. Join 15,000+ active students."
        keywords="finance courses, investment banking training, financial modeling certification, portfolio management, career development, online finance education"
        url="https://lms-platform.com/"
      />
      
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', 
        color: 'white', 
        py: { xs: 6, sm: 8, md: 12 } 
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 3, sm: 4, md: 6 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip
                label="🎓 #1 Finance Learning Platform"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mb: { xs: 2, md: 3 } }}
              />
              <Typography 
                variant="h2" 
                fontWeight={700} 
                gutterBottom
                sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' } }}
              >
                Master Finance & Build Your Career
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: { xs: 3, md: 4 }, 
                  opacity: 0.9,
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                }}
              >
                Learn from industry experts. Get certified. Land your dream job in finance.
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/courses')}
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main', 
                    px: 4, 
                    minHeight: 48,
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': { bgcolor: 'grey.100' } 
                  }}
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
                    minHeight: 48,
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': { borderColor: 'grey.300', bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Learn More
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600"
                alt="Finance Learning Platform"
                sx={{ width: '100%', borderRadius: 4, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 4, sm: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 3, sm: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ color: 'primary.main', mb: 1, fontSize: { xs: 32, sm: 40 } }}>{stat.icon}</Box>
                  <Typography 
                    variant="h3" 
                    fontWeight={700} 
                    color="primary"
                    sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6, md: 8 } }}>
          <Typography 
            variant="h3" 
            fontWeight={700} 
            gutterBottom
            sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
          >
            Why Choose Finance Academy
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
          >
            Everything you need to succeed in finance
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: { xs: 2, sm: 3 },
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'translateY(-8px)', boxShadow: 4, borderColor: 'primary.main' },
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2, fontSize: { xs: 32, sm: 40 } }}>{feature.icon}</Box>
                <Typography 
                  variant="h6" 
                  fontWeight={600} 
                  gutterBottom
                  sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}
                >
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Courses */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, sm: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 5, md: 6 } }}>
            <Typography 
              variant="h3" 
              fontWeight={700} 
              gutterBottom
              sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
            >
              Popular Courses
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
            >
              Start learning from our top-rated courses
            </Typography>
          </Box>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {courses.map((course, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
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
                  <CardMedia 
                    component="img" 
                    height="200" 
                    image={course.image} 
                    alt={course.title}
                    sx={{ height: { xs: 150, sm: 200 } }}
                  />
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Chip label={course.level} size="small" color="primary" sx={{ mb: 2 }} />
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      gutterBottom
                      sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
                    >
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
          <Box sx={{ textAlign: 'center', mt: { xs: 4, sm: 5, md: 6 } }}>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/courses')}
              sx={{ minHeight: 48, px: { xs: 3, sm: 4 } }}
            >
              View All Courses
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 6, sm: 8, md: 10 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            fontWeight={700} 
            gutterBottom
            sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
          >
            Ready to Transform Your Career?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: { xs: 3, md: 4 }, 
              opacity: 0.9,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
            }}
          >
            Join thousands of students who have launched their finance careers
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main', 
                px: 5, 
                minHeight: 48,
                width: { xs: '100%', sm: 'auto' },
                '&:hover': { bgcolor: 'grey.100' } 
              }}
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
                minHeight: 48,
                width: { xs: '100%', sm: 'auto' },
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
