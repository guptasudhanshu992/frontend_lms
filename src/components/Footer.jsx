import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { School, LinkedIn, Twitter, Facebook, YouTube } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', mt: 0, py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <School sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Finance Academy
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Empowering the next generation of finance professionals through world-class
              education and practical training.
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedIn />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" aria-label="YouTube">
                <YouTube />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Company
            </Typography>
            <Link
              component={RouterLink}
              to="/about"
              color="inherit"
              underline="hover"
              display="block"
              sx={{ mb: 1, opacity: 0.9 }}
            >
              About Us
            </Link>
            <Link
              component={RouterLink}
              to="/courses"
              color="inherit"
              underline="hover"
              display="block"
              sx={{ mb: 1, opacity: 0.9 }}
            >
              Courses
            </Link>
            <Link
              component={RouterLink}
              to="/blog"
              color="inherit"
              underline="hover"
              display="block"
              sx={{ mb: 1, opacity: 0.9 }}
            >
              Blog
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block" sx={{ opacity: 0.9 }}>
              Careers
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Support
            </Typography>
            <Link href="#" color="inherit" underline="hover" display="block" sx={{ mb: 1, opacity: 0.9 }}>
              Help Center
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block" sx={{ mb: 1, opacity: 0.9 }}>
              Contact Us
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block" sx={{ mb: 1, opacity: 0.9 }}>
              FAQ
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block" sx={{ opacity: 0.9 }}>
              Community
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Legal
            </Typography>
            <Link href="#" color="inherit" underline="hover" display="block" sx={{ mb: 1, opacity: 0.9 }}>
              Terms of Service
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block" sx={{ mb: 1, opacity: 0.9 }}>
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block" sx={{ mb: 1, opacity: 0.9 }}>
              Cookie Policy
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block" sx={{ opacity: 0.9 }}>
              Refund Policy
            </Link>
          </Grid>
        </Grid>

        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.2)', mt: 4, pt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} Finance Academy. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
