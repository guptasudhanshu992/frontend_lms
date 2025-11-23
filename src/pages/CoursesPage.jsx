import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import {
  People,
  Schedule,
  Star,
} from '@mui/icons-material';
import SEO from '../components/SEO';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export default function CoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const coursesPerPage = 20;

  useEffect(() => {
    fetchCourses();
  }, [page]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const offset = (page - 1) * coursesPerPage;
      const response = await axios.get(`${API_BASE}/api/public/courses?limit=${coursesPerPage}&offset=${offset}`);
      setCourses(response.data.courses || []);
      setTotal(response.data.total || response.data.courses?.length || 0);
      setTotalPages(Math.ceil((response.data.total || response.data.courses?.length || 0) / coursesPerPage));
      setError('');
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box>
      <SEO 
        title="Finance Courses - Professional Development & Certification Programs"
        description="Master finance skills with our expert-led courses in financial modeling, investment banking, portfolio management, and corporate finance. 300+ courses designed for career growth and certification."
        keywords="finance courses, financial modeling training, investment banking courses, portfolio management certification, corporate finance education, professional finance training"
        url="https://lms-platform.com/courses"
      />
      
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 6, sm: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              fontWeight={700} 
              gutterBottom
              sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' } }}
            >
              Finance Courses
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                maxWidth: '700px', 
                mx: 'auto', 
                opacity: 0.9,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                px: { xs: 2, sm: 0 }
              }}
            >
              Master finance skills with expert-led courses designed for career growth
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Stats */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 4, sm: 5, md: 6 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 3, sm: 4 }} textAlign="center">
            {[
              { value: courses.length > 0 ? `${courses.length}+` : '0', label: 'Finance Courses' },
              { value: '10,000+', label: 'Active Students' },
              { value: '95%', label: 'Satisfaction Rate' },
            ].map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Typography 
                  variant="h3" 
                  color="primary" 
                  fontWeight="bold"
                  sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
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
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Courses Grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 7, md: 8 } }}>
        <Box sx={{ mb: { xs: 4, sm: 5, md: 6 }, px: { xs: 2, sm: 0 } }}>
          <Typography 
            variant="h4" 
            fontWeight={700} 
            gutterBottom
            sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}
          >
            All Courses
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Choose from our comprehensive collection of finance courses
          </Typography>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert severity="error" sx={{ mb: 4, mx: { xs: 2, sm: 0 } }}>
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {!loading && !error && courses.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8, px: { xs: 2, sm: 0 } }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No courses available at the moment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check back soon for new courses!
            </Typography>
          </Box>
        )}

        {/* Courses Grid */}
        {!loading && courses.length > 0 && (
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
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
                  {course.image_url && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={course.image_url}
                      alt={course.title}
                      sx={{ 
                        objectFit: 'cover',
                        height: { xs: 150, sm: 180 }
                      }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                    <Stack 
                      direction="row" 
                      spacing={1} 
                      sx={{ 
                        mb: 2,
                        flexWrap: 'wrap',
                        gap: 1
                      }}
                    >
                      {course.level && <Chip label={course.level} size="small" color="primary" />}
                      {course.category && <Chip label={course.category} size="small" variant="outlined" />}
                    </Stack>
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      gutterBottom
                      sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
                    >
                      {course.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 3,
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {course.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      {course.instructor && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <People fontSize="small" color="action" />
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                          >
                            {course.instructor}
                          </Typography>
                        </Box>
                      )}
                      {course.duration && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Schedule fontSize="small" color="action" />
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                          >
                            {course.duration}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {courses.length > 0 && totalPages > 1 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: { xs: 4, sm: 5, md: 6 },
            px: { xs: 2, sm: 0 }
          }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  minWidth: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
            />
          </Box>
        )}
      </Container>

      {/* CTA */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 6, sm: 7, md: 8 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center', px: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="h4" 
            fontWeight={700} 
            gutterBottom
            sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}
          >
            Ready to Master Finance?
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3, 
              opacity: 0.9,
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            Join thousands of students learning from industry professionals
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main', 
              px: 5, 
              minHeight: 48,
              width: { xs: '100%', sm: 'auto' },
              '&:hover': { bgcolor: 'grey.100' } 
            }}
            onClick={() => navigate('/register')}
          >
            Get Started Today
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
