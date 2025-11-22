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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import AdminLayout from '../../components/admin/AdminLayout';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

const AVAILABLE_PERMISSIONS = [
  'user.read', 'user.write', 'user.delete',
  'course.read', 'course.write', 'course.delete',
  'content.read', 'content.write', 'content.delete',
  'admin.access', 'analytics.view',
];

export default function RolesManagement() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [],
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_BASE}/api/admin/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(response.data.roles || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch roles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`${API_BASE}/api/admin/roles`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpenDialog(false);
      setFormData({ name: '', description: '', permissions: [] });
      fetchRoles();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create role');
    }
  };

  const handleUpdateRole = async (roleId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`${API_BASE}/api/admin/roles/${roleId}`, {
        permissions: formData.permissions,
        description: formData.description,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpenDialog(false);
      setEditRole(null);
      fetchRoles();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update role');
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${API_BASE}/api/admin/roles/${roleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRoles();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete role');
    }
  };

  const openCreateDialog = () => {
    setEditRole(null);
    setFormData({ name: '', description: '', permissions: [] });
    setOpenDialog(true);
  };

  const openEditDialog = (role) => {
    setEditRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions || [],
    });
    setOpenDialog(true);
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
        <Typography variant="h4">Roles Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openCreateDialog}>
          Create Role
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.id}</TableCell>
                <TableCell>
                  <Chip label={role.name} color="primary" />
                </TableCell>
                <TableCell>{role.description || '-'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {role.permissions?.slice(0, 3).map((perm, idx) => (
                      <Chip key={idx} label={perm} size="small" />
                    ))}
                    {role.permissions?.length > 3 && (
                      <Chip label={`+${role.permissions.length - 3} more`} size="small" variant="outlined" />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openEditDialog(role)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteRole(role.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Role Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            disabled={!!editRole}
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Permissions</InputLabel>
            <Select
              multiple
              value={formData.permissions}
              onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
              input={<OutlinedInput label="Permissions" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {AVAILABLE_PERMISSIONS.map((perm) => (
                <MenuItem key={perm} value={perm}>
                  {perm}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => editRole ? handleUpdateRole(editRole.id) : handleCreateRole()}
          >
            {editRole ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}
