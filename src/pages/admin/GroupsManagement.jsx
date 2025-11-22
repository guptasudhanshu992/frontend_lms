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
import api from '../../api';

const AVAILABLE_PERMISSIONS = [
  'user.read', 'user.write', 'user.delete',
  'course.read', 'course.write', 'course.delete',
  'content.read', 'content.write', 'content.delete',
  'admin.access', 'analytics.view',
];

export default function GroupsManagement() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editGroup, setEditGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [],
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await api.get('/api/admin/groups');
      setGroups(response.data.groups || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch groups');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    try {
      await api.post('/api/admin/groups', formData);
      setOpenDialog(false);
      setFormData({ name: '', description: '', permissions: [] });
      fetchGroups();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create group');
    }
  };

  const handleUpdateGroup = async (groupId) => {
    try {
      await api.put(`/api/admin/groups/${groupId}`, {
        permissions: formData.permissions,
        description: formData.description,
      });
      setOpenDialog(false);
      setEditGroup(null);
      fetchGroups();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update group');
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!confirm('Are you sure you want to delete this group?')) return;
    
    try {
      await api.delete(`/api/admin/groups/${groupId}`);
      fetchGroups();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete group');
    }
  };

  const openCreateDialog = () => {
    setEditGroup(null);
    setFormData({ name: '', description: '', permissions: [] });
    setOpenDialog(true);
  };

  const openEditDialog = (group) => {
    setEditGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
      permissions: group.permissions || [],
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
        <Typography variant="h4">Groups Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openCreateDialog}>
          Create Group
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
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.id}</TableCell>
                <TableCell>
                  <Chip label={group.name} color="secondary" />
                </TableCell>
                <TableCell>{group.description || '-'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {group.permissions?.slice(0, 3).map((perm, idx) => (
                      <Chip key={idx} label={perm} size="small" />
                    ))}
                    {group.permissions?.length > 3 && (
                      <Chip label={`+${group.permissions.length - 3} more`} size="small" variant="outlined" />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openEditDialog(group)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteGroup(group.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Group Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editGroup ? 'Edit Group' : 'Create New Group'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            disabled={!!editGroup}
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
            onClick={() => editGroup ? handleUpdateGroup(editGroup.id) : handleCreateGroup()}
          >
            {editGroup ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}
