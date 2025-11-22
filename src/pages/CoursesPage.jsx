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
  CardMedia,
  Chip,
  Stack,
} from '@mui/material';
import {
  TrendingUp,
  School,
  Assessment,
  AccountBalance,
  Psychology,
  ShowChart,
  People,
  Schedule,
  Star,
} from '@mui/icons-material';

const courses = [
  {
    id: 1,
    title: 'Financial Markets Fundamentals',
    description: 'Master the basics of stocks, bonds, and market dynamics',
    level: 'Beginner',
    duration: '8 weeks',
    price: '$299',
    rating: 4.8,
    students: '1,250',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
  },
  {
    id: 2,
    title: 'Investment Strategies & Portfolio Management',
    description: 'Learn to build and manage diversified investment portfolios',
    level: 'Intermediate',
    duration: '10 weeks',
    price: '$349',
    rating: 4.9,
    students: '890',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
  },
  {
    id: 3,
    title: 'Corporate Finance & Valuation',
    description: 'Financial statements, valuation methods, and corporate decisions',
    level: 'Intermediate',
    duration: '12 weeks',
    price: '$399',
    rating: 4.7,
    students: '720',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
  },
  {
    id: 4,
    title: 'Technical Analysis & Trading',
    description: 'Master chart patterns, indicators, and trading strategies',
    level: 'Advanced',
    duration: '6 weeks',
    price: '$449',
    rating: 4.6,
    students: '650',
    image: 'https://images.unsplash.com/photo-1642790551116-18e150f248e5?w=400',
  },
  {
    id: 5,
    title: 'Risk Management & Derivatives',
    description: 'Understand options, futures, and hedging strategies',
    level: 'Advanced',
    duration: '10 weeks',
    price: '$499',
    rating: 4.8,
    students: '480',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400',
  },
  {
    id: 6,
    title: 'Investment Banking Fundamentals',
    description: 'M&A, capital markets, and financial modeling for investment banking',
    level: 'Advanced',
    duration: '14 weeks',
    price: '$599',
    rating: 4.9,
    students: '390',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
  },
];

export default function CoursesPage() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" fontWeight={700} gutterBottom>
              Finance Courses
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: '700px', mx: 'auto', opacity: 0.9 }}>
              Master finance skills with expert-led courses designed for career growth
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Stats */}
      <Box sx={{ bgcolor: 'grey.50', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            {[
              { value: '50+', label: 'Finance Courses' },
              { value: '10,000+', label: 'Active Students' },
              { value: '95%', label: 'Satisfaction Rate' },
            ].map((stat, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Courses Grid */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            All Courses
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Choose from our comprehensive collection of finance courses
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
                onClick={() => navigate('/register')}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={course.image}
                  alt={course.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip label={course.level} size="small" color="primary" />
                    <Chip label={course.price} size="small" variant="outlined" />
                  </Stack>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {course.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star fontSize="small" sx={{ color: 'warning.main' }} />
                      <Typography variant="body2" fontWeight={600}>
                        {course.rating}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <People fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {course.students}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Schedule fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {course.duration}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Ready to Master Finance?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Join thousands of students learning from industry professionals
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ bgcolor: 'white', color: 'primary.main', px: 5, '&:hover': { bgcolor: 'grey.100' } }}
            onClick={() => navigate('/register')}
          >
            Get Started Today
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
