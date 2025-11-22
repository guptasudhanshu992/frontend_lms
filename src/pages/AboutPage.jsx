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
  Avatar,
  Stack,
  Chip,
} from '@mui/material';
import {
  School,
  TrendingUp,
  People,
  EmojiEvents,
  CheckCircle,
  Lightbulb,
  Speed,
  GroupWork,
} from '@mui/icons-material';

export default function AboutPage() {
  const navigate = useNavigate();

  const stats = [
    { icon: <School sx={{ fontSize: 40 }} />, value: '50+', label: 'Expert Courses' },
    { icon: <People sx={{ fontSize: 40 }} />, value: '15k+', label: 'Active Students' },
    { icon: <TrendingUp sx={{ fontSize: 40 }} />, value: '98%', label: 'Success Rate' },
    { icon: <EmojiEvents sx={{ fontSize: 40 }} />, value: '5k+', label: 'Certifications' },
  ];

  const values = [
    {
      icon: <Lightbulb sx={{ fontSize: 50 }} />,
      title: 'Innovation',
      description: 'Cutting-edge curriculum that evolves with the finance industry',
    },
    {
      icon: <CheckCircle sx={{ fontSize: 50 }} />,
      title: 'Excellence',
      description: 'World-class instruction from industry-leading professionals',
    },
    {
      icon: <Speed sx={{ fontSize: 50 }} />,
      title: 'Efficiency',
      description: 'Fast-track your learning with structured, practical content',
    },
    {
      icon: <GroupWork sx={{ fontSize: 50 }} />,
      title: 'Community',
      description: 'Join a network of ambitious finance professionals worldwide',
    },
  ];

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Head of Finance',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      name: 'Michael Chen',
      role: 'Trading Instructor',
      avatar: 'https://i.pravatar.cc/150?img=13',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Portfolio Expert',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      name: 'David Kim',
      role: 'Investment Banking',
      avatar: 'https://i.pravatar.cc/150?img=7',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 12 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Chip
              label="About Us"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mb: 3 }}
            />
            <Typography variant="h2" fontWeight={700} gutterBottom>
              Transforming Finance Education
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: '800px', mx: 'auto', opacity: 0.9 }}>
              We're on a mission to democratize finance education and empower the next generation
              of financial professionals with world-class learning experiences
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'translateY(-8px)' },
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{stat.icon}</Box>
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

      {/* Mission Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600"
              alt="Team"
              sx={{
                width: '100%',
                borderRadius: 4,
                boxShadow: 4,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.02)' },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Finance Academy was founded with a simple yet powerful vision: to make world-class
              finance education accessible to everyone, regardless of background or location.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We believe that quality education is the key to unlocking opportunities and building
              successful careers in finance. Our courses are designed by industry experts who bring
              real-world experience into every lesson.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/courses')}
              sx={{ mt: 2 }}
            >
              Explore Our Courses
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* Values Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Our Core Values
            </Typography>
            <Typography variant="h6" color="text.secondary">
              The principles that guide everything we do
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {values.map((value, index) => (
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
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 4,
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{value.icon}</Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Meet Our Expert Team
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Industry veterans dedicated to your success
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {team.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  textAlign: 'center',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-8px)' },
                }}
              >
                <Avatar
                  src={member.avatar}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    border: '4px solid',
                    borderColor: 'primary.main',
                  }}
                />
                <Typography variant="h6" fontWeight={600}>
                  {member.name}
                </Typography>
                <Typography variant="body2" color="primary">
                  {member.role}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 10 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Join Our Learning Community
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Start your journey towards a successful finance career today
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ bgcolor: 'white', color: 'primary.main', px: 5, '&:hover': { bgcolor: 'grey.100' } }}
            >
              Get Started
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
              View Courses
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
