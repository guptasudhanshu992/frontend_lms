import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Chip,
  Avatar,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { CalendarMonth, Person, ArrowBack, Share } from '@mui/icons-material';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/public/blogs/${id}`);
      setBlog(response.data);
      
      // Fetch related blogs
      const relatedResponse = await axios.get(`${API_BASE}/api/public/blogs`);
      const related = relatedResponse.data.blogs
        .filter(b => b.id !== parseInt(id) && b.category === response.data.category && b.published)
        .slice(0, 3);
      setRelatedBlogs(related);
      
      setError('');
    } catch (err) {
      setError('Blog post not found');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 8, minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !blog) {
    return (
      <Container sx={{ mt: 8, minHeight: '60vh' }}>
        <Alert severity="error">{error || 'Blog post not found'}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/blog')} sx={{ mt: 2 }}>
          Back to Blog
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 0 }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/blog')}
          sx={{ mb: 3 }}
        >
          Back to Blog
        </Button>

        {/* Article Header */}
        <Paper elevation={0} sx={{ p: 4, mb: 4, bgcolor: 'transparent' }}>
          <Chip label={blog.category} color="primary" sx={{ mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
            {blog.title}
          </Typography>
          
          {/* Author Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {blog.author[0]}
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {blog.author}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonth fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Button
              startIcon={<Share />}
              variant="outlined"
              size="small"
              onClick={handleShare}
            >
              Share
            </Button>
          </Box>

          {/* Featured Image */}
          {blog.image_url && (
            <Box
              component="img"
              src={blog.image_url}
              alt={blog.title}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 500,
                objectFit: 'cover',
                borderRadius: 2,
                mb: 4,
              }}
            />
          )}

          {/* Excerpt */}
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, fontStyle: 'italic', lineHeight: 1.6 }}
          >
            {blog.excerpt}
          </Typography>

          <Divider sx={{ mb: 4 }} />

          {/* Content */}
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.8,
              fontSize: '1.1rem',
              whiteSpace: 'pre-wrap',
              '& p': { mb: 2 },
            }}
          >
            {blog.content}
          </Typography>
        </Paper>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
              Related Articles
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {relatedBlogs.map((relatedBlog) => (
                <Paper
                  key={relatedBlog.id}
                  elevation={0}
                  sx={{
                    p: 3,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      boxShadow: 2,
                      transform: 'translateX(8px)',
                    },
                  }}
                  onClick={() => {
                    navigate(`/blog/${relatedBlog.id}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  <Chip label={relatedBlog.category} size="small" color="primary" sx={{ mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    {relatedBlog.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {relatedBlog.excerpt}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {relatedBlog.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      •
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(relatedBlog.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
