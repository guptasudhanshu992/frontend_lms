import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Stack,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Publish,
  Image as ImageIcon,
  ExpandMore,
  Delete,
} from '@mui/icons-material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AdminLayout from '../../components/admin/AdminLayout';
import SEO from '../../components/SEO';
import api from '../../api';

export default function BlogFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingOgImage, setUploadingOgImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    categories: [],
    tags: [],
    image_url: '',
    image_alt: '',
    featured: false,
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    og_title: '',
    og_description: '',
    og_image_url: '',
    og_image_alt: '',
    published: false,
    publish_at: null,
  });

  useEffect(() => {
    fetchCategories();
    fetchTags();
    if (isEditMode) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/api/admin/blogs/${id}`);
      const blog = response.data;
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        author: blog.author || '',
        categories: blog.categories || [],
        tags: blog.tags || [],
        image_url: blog.image_url || '',
        image_alt: blog.image_alt || '',
        featured: blog.featured || false,
        meta_title: blog.meta_title || '',
        meta_description: blog.meta_description || '',
        canonical_url: blog.canonical_url || '',
        og_title: blog.og_title || '',
        og_description: blog.og_description || '',
        og_image_url: blog.og_image_url || '',
        og_image_alt: blog.og_image_alt || '',
        published: blog.published || false,
        publish_at: blog.publish_at ? new Date(blog.publish_at) : null,
      });
    } catch (err) {
      setError('Failed to fetch blog details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/admin/categories');
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await api.get('/api/admin/tags');
      setTags(response.data.tags || []);
    } catch (err) {
      console.error('Failed to fetch tags', err);
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setFormData({
      ...formData,
      title: newTitle,
      slug: isEditMode ? formData.slug : newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    });
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const setUploading = field === 'image_url' ? setUploadingImage : setUploadingOgImage;
    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const response = await api.post('/api/r2/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData({ ...formData, [field]: response.data.url });
      setSuccess('Image uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to upload image: ' + (err.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (publishNow = false) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.title || !formData.slug || !formData.excerpt || !formData.content || !formData.author) {
        setError('Please fill in all required fields');
        setSaving(false);
        return;
      }

      // Validate publish_at is in future if provided
      if (formData.publish_at && new Date(formData.publish_at) <= new Date()) {
        setError('Publish date must be in the future');
        setSaving(false);
        return;
      }

      const payload = { ...formData, published: publishNow || formData.published };

      if (isEditMode) {
        await api.put(`/api/admin/blogs/${id}`, payload);
        setSuccess('Blog updated successfully!');
      } else {
        await api.post('/api/admin/blogs', payload);
        setSuccess('Blog created successfully!');
      }

      setTimeout(() => {
        navigate('/admin/blog');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video', 'code-block'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['clean']
    ]
  };

  return (
    <AdminLayout>
      <SEO 
        title={`${isEditMode ? 'Edit' : 'Create'} Blog Post - Admin Panel`}
        description="Create or edit blog posts for your learning management system."
      />

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/blog')}
          sx={{ mb: 2 }}
        >
          Back to Blog Management
        </Button>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEditMode ? 'Update your blog post with the latest information' : 'Fill in the details to create a new blog post'}
        </Typography>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <Card elevation={2}>
            <CardContent sx={{ p: 4 }}>
              {/* Basic Information */}
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Basic Information
              </Typography>

              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={handleTitleChange}
                margin="normal"
                required
                placeholder="Enter a compelling blog title"
                helperText="This will be displayed as the main heading"
              />

              <TextField
                fullWidth
                label="Slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                margin="normal"
                required
                placeholder="blog-post-url-slug"
                helperText="URL-friendly version of the title. Auto-generated but editable."
              />

              <TextField
                fullWidth
                label="Author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                margin="normal"
                required
                placeholder="Author name"
              />

              <TextField
                fullWidth
                label="Excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                margin="normal"
                multiline
                rows={3}
                required
                placeholder="A brief summary of your blog post (150-200 characters)"
                helperText={`${formData.excerpt.length} characters`}
              />

              <Divider sx={{ my: 4 }} />

              {/* Content Editor */}
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Content *
              </Typography>
              <Box sx={{ 
                '& .quill': { 
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                },
                '& .ql-container': {
                  minHeight: '400px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                },
                '& .ql-editor': {
                  minHeight: '400px',
                }
              }}>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  modules={quillModules}
                  placeholder="Write your blog content here..."
                />
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Categories and Tags */}
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Organization
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    multiple
                    options={categories}
                    getOptionLabel={(option) => option.name}
                    value={categories.filter(c => formData.categories.includes(c.id))}
                    onChange={(e, newValue) => {
                      setFormData({ ...formData, categories: newValue.map(v => v.id) });
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Categories" placeholder="Select categories" />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip 
                          label={option.name} 
                          {...getTagProps({ index })} 
                          size="small" 
                          color="primary"
                        />
                      ))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    multiple
                    options={tags}
                    getOptionLabel={(option) => option.name}
                    value={tags.filter(t => formData.tags.includes(t.id))}
                    onChange={(e, newValue) => {
                      setFormData({ ...formData, tags: newValue.map(v => v.id) });
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Tags" placeholder="Select tags" />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip 
                          label={option.name} 
                          {...getTagProps({ index })} 
                          size="small" 
                          variant="outlined"
                        />
                      ))
                    }
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              {/* Featured Image */}
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Featured Image
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={uploadingImage ? <CircularProgress size={20} /> : <ImageIcon />}
                  disabled={uploadingImage}
                  fullWidth
                  sx={{ mb: 2, py: 1.5 }}
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Featured Image'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleImageUpload(e, 'image_url')}
                  />
                </Button>

                {formData.image_url && (
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <img 
                      src={formData.image_url} 
                      alt={formData.image_alt || 'Featured'} 
                      style={{ 
                        width: '100%', 
                        maxHeight: '300px', 
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }} 
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' }
                      }}
                      onClick={() => setFormData({ ...formData, image_url: '', image_alt: '' })}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                )}

                <TextField
                  fullWidth
                  label="Image Alt Text"
                  value={formData.image_alt}
                  onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                  placeholder="Describe the image for accessibility"
                  helperText="Important for SEO and accessibility"
                />
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* SEO Section */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">SEO Settings</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Meta Title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                      placeholder="SEO-optimized title (50-60 characters)"
                      helperText={`${formData.meta_title.length}/60 characters`}
                    />
                    <TextField
                      fullWidth
                      label="Meta Description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      multiline
                      rows={2}
                      placeholder="Brief description for search engines (150-160 characters)"
                      helperText={`${formData.meta_description.length}/160 characters`}
                    />
                    <TextField
                      fullWidth
                      label="Canonical URL"
                      value={formData.canonical_url}
                      onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                      placeholder="https://example.com/blog/post"
                      helperText="Preferred URL for this content"
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>

              {/* Open Graph Section */}
              <Accordion sx={{ mt: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">Social Media (Open Graph)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="OG Title"
                      value={formData.og_title}
                      onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                      placeholder="Title for social media shares"
                    />
                    <TextField
                      fullWidth
                      label="OG Description"
                      value={formData.og_description}
                      onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                      multiline
                      rows={2}
                      placeholder="Description for social media shares"
                    />
                    
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={uploadingOgImage ? <CircularProgress size={20} /> : <ImageIcon />}
                      disabled={uploadingOgImage}
                      fullWidth
                    >
                      {uploadingOgImage ? 'Uploading...' : 'Upload OG Image'}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleImageUpload(e, 'og_image_url')}
                      />
                    </Button>

                    {formData.og_image_url && (
                      <Box sx={{ position: 'relative' }}>
                        <img 
                          src={formData.og_image_url} 
                          alt={formData.og_image_alt || 'OG'} 
                          style={{ 
                            width: '100%', 
                            maxHeight: '200px', 
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }} 
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'error.main',
                            color: 'white',
                            '&:hover': { bgcolor: 'error.dark' }
                          }}
                          onClick={() => setFormData({ ...formData, og_image_url: '', og_image_alt: '' })}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    )}

                    <TextField
                      fullWidth
                      label="OG Image Alt Text"
                      value={formData.og_image_alt}
                      onChange={(e) => setFormData({ ...formData, og_image_alt: e.target.value })}
                      placeholder="Alt text for OG image"
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Publish Settings */}
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Publish Settings
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Featured Post"
                />

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, ml: 4 }}>
                  Featured posts appear prominently on the blog page
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Schedule Publish"
                    value={formData.publish_at}
                    onChange={(newValue) => setFormData({ ...formData, publish_at: newValue })}
                    minDateTime={new Date()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        helperText: 'Leave empty to publish immediately',
                        size: 'small'
                      }
                    }}
                  />
                </LocalizationProvider>

                {formData.publish_at && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Will auto-publish on {new Date(formData.publish_at).toLocaleString()}
                  </Alert>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Action Buttons */}
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Publish />}
                    onClick={() => handleSave(true)}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Publish Now'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    startIcon={<Save />}
                    onClick={() => handleSave(false)}
                    disabled={saving}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    variant="text"
                    fullWidth
                    onClick={() => navigate('/admin/blog')}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card elevation={1} sx={{ bgcolor: 'primary.50' }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  💡 Quick Tips
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Use a clear, descriptive title (50-60 characters)
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Write a compelling excerpt to attract readers
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Add alt text to images for better SEO
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Use categories and tags to organize content
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
