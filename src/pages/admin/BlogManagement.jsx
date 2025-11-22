import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Autocomplete,
  Stack,
} from '@mui/material';
import { Edit, Delete, Add, Category as CategoryIcon, Label as LabelIcon } from '@mui/icons-material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api';

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tabValue, setTabValue] = useState(0);
  
  // Category/Tag Management
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [openTagDialog, setOpenTagDialog] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [editTag, setEditTag] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', description: '' });
  const [tagFormData, setTagFormData] = useState({ name: '' });
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    image_url: '',
    published: false,
    publish_at: null,
    tags: [],
  });

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
    fetchTags();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/api/admin/blogs');
      setBlogs(response.data.blogs || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch blogs');
      console.error(err);
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

  const handleCreateBlog = async () => {
    try {
      // Validate publish_at is in future if provided
      if (formData.publish_at && new Date(formData.publish_at) <= new Date()) {
        setError('Publish date must be in the future');
        return;
      }
      
      await api.post('/api/admin/blogs', formData);
      setOpenDialog(false);
      resetForm();
      fetchBlogs();
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create blog');
    }
  };

  const handleUpdateBlog = async (blogId) => {
    try {
      // Validate publish_at is in future if provided
      if (formData.publish_at && new Date(formData.publish_at) <= new Date()) {
        setError('Publish date must be in the future');
        return;
      }
      
      await api.put(`/api/admin/blogs/${blogId}`, formData);
      setOpenDialog(false);
      setEditBlog(null);
      resetForm();
      fetchBlogs();
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update blog');
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      await api.delete(`/api/admin/blogs/${blogId}`);
      fetchBlogs();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete blog');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      category: '',
      image_url: '',
      published: false,
      publish_at: null,
      tags: [],
    });
  };

  const openCreateDialog = () => {
    setEditBlog(null);
    resetForm();
    setOpenDialog(true);
  };

  const openEditDialog = (blog) => {
    setEditBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      image_url: blog.image_url || '',
      published: blog.published,
      publish_at: blog.publish_at ? new Date(blog.publish_at) : null,
      tags: blog.tags || [],
    });
    setOpenDialog(true);
  };

  // Category Management Functions
  const handleCreateCategory = async () => {
    try {
      await api.post('/api/admin/categories', categoryFormData);
      setOpenCategoryDialog(false);
      setCategoryFormData({ name: '', description: '' });
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create category');
    }
  };

  const handleUpdateCategory = async (categoryId) => {
    try {
      await api.put(`/api/admin/categories/${categoryId}`, categoryFormData);
      setOpenCategoryDialog(false);
      setEditCategory(null);
      setCategoryFormData({ name: '', description: '' });
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/api/admin/categories/${categoryId}`);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete category');
    }
  };

  // Tag Management Functions
  const handleCreateTag = async () => {
    try {
      await api.post('/api/admin/tags', tagFormData);
      setOpenTagDialog(false);
      setTagFormData({ name: '' });
      fetchTags();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create tag');
    }
  };

  const handleUpdateTag = async (tagId) => {
    try {
      await api.put(`/api/admin/tags/${tagId}`, tagFormData);
      setOpenTagDialog(false);
      setEditTag(null);
      setTagFormData({ name: '' });
      fetchTags();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update tag');
    }
  };

  const handleDeleteTag = async (tagId) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;
    try {
      await api.delete(`/api/admin/tags/${tagId}`);
      fetchTags();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete tag');
    }
  };

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Blog Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openCreateDialog}>
          Create Blog Post
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Blog Posts" />
          <Tab label="Categories" icon={<CategoryIcon />} iconPosition="start" />
          <Tab label="Tags" icon={<LabelIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Blog Posts Tab */}
      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Publish Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>{blog.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 300 }} noWrap>
                      {blog.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{blog.author}</TableCell>
                  <TableCell>
                    <Chip label={blog.category} size="small" color="primary" />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {(blog.tags || []).map((tagId) => {
                        const tag = tags.find(t => t.id === tagId);
                        return tag ? <Chip key={tagId} label={tag.name} size="small" variant="outlined" /> : null;
                      })}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    {blog.publish_at ? (
                      <Typography variant="caption" color="primary">
                        {new Date(blog.publish_at).toLocaleString()}
                      </Typography>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={blog.published ? 'Published' : (blog.publish_at ? 'Scheduled' : 'Draft')}
                      color={blog.published ? 'success' : (blog.publish_at ? 'info' : 'default')}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEditDialog(blog)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteBlog(blog.id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={blogs.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>
      )}

      {/* Categories Tab */}
      {tabValue === 1 && (
        <Paper>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Categories</Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<Add />}
              onClick={() => {
                setEditCategory(null);
                setCategoryFormData({ name: '', description: '' });
                setOpenCategoryDialog(true);
              }}
            >
              Add Category
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      <Chip label={category.slug} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{category.description || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditCategory(category);
                          setCategoryFormData({ name: category.name, description: category.description || '' });
                          setOpenCategoryDialog(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteCategory(category.id)} color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Tags Tab */}
      {tabValue === 2 && (
        <Paper>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Tags</Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<Add />}
              onClick={() => {
                setEditTag(null);
                setTagFormData({ name: '' });
                setOpenTagDialog(true);
              }}
            >
              Add Tag
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>{tag.id}</TableCell>
                    <TableCell>{tag.name}</TableCell>
                    <TableCell>
                      <Chip label={tag.slug} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditTag(tag);
                          setTagFormData({ name: tag.name });
                          setOpenTagDialog(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteTag(tag.id)} color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Create/Edit Blog Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              margin="normal"
              multiline
              rows={2}
              required
            />
            <TextField
              fullWidth
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              margin="normal"
              multiline
              rows={6}
              required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <TextField
              fullWidth
              label="Image URL"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              margin="normal"
            />
            <Autocomplete
              multiple
              options={tags}
              getOptionLabel={(option) => option.name}
              value={tags.filter(t => formData.tags.includes(t.id))}
              onChange={(e, newValue) => {
                setFormData({ ...formData, tags: newValue.map(v => v.id) });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  margin="normal"
                  placeholder="Select tags"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    size="small"
                  />
                ))
              }
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.value })}
                  label="Status"
                >
                  <MenuItem value={true}>Published</MenuItem>
                  <MenuItem value={false}>Draft</MenuItem>
                </Select>
              </FormControl>
              <DateTimePicker
                label="Publish Date/Time (Optional)"
                value={formData.publish_at}
                onChange={(newValue) => setFormData({ ...formData, publish_at: newValue })}
                minDateTime={new Date()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                    helperText: 'Set future date to auto-publish'
                  }
                }}
              />
            </Box>
            {formData.publish_at && (
              <Alert severity="info" sx={{ mt: 2 }}>
                This blog will be automatically published on {new Date(formData.publish_at).toLocaleString()}
              </Alert>
            )}
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => editBlog ? handleUpdateBlog(editBlog.id) : handleCreateBlog()}
          >
            {editBlog ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            value={categoryFormData.name}
            onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={categoryFormData.description}
            onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => editCategory ? handleUpdateCategory(editCategory.id) : handleCreateCategory()}
          >
            {editCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tag Dialog */}
      <Dialog open={openTagDialog} onClose={() => setOpenTagDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editTag ? 'Edit Tag' : 'Create Tag'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tag Name"
            value={tagFormData.name}
            onChange={(e) => setTagFormData({ ...tagFormData, name: e.target.value })}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTagDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => editTag ? handleUpdateTag(editTag.id) : handleCreateTag()}
          >
            {editTag ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}
