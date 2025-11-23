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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  TablePagination,
  Tabs,
  Tab,
  OutlinedInput,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  CheckCircle,
  Cancel,
  Block,
  Computer,
  Smartphone,
} from '@mui/icons-material';
import AdminLayout from '../../components/admin/AdminLayout';
import SEO from '../../components/SEO';
import api from '../../api';

const AVAILABLE_PERMISSIONS = [
  'user.read', 'user.write', 'user.delete',
  'course.read', 'course.write', 'course.delete',
  'content.read', 'content.write', 'content.delete',
  'admin.access', 'analytics.view',
];

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ marginTop: 24 }}>
      {value === index && children}
    </div>
  );
}

export default function UsersManagement() {
  const [tabValue, setTabValue] = useState(0);
  
  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState('');
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [userPage, setUserPage] = useState(0);
  const [userRowsPerPage, setUserRowsPerPage] = useState(10);
  const [userFormData, setUserFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'student',
  });

  // Roles state
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState('');
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [roleFormData, setRoleFormData] = useState({
    name: '',
    description: '',
    permissions: [],
  });

  // Groups state
  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [groupsError, setGroupsError] = useState('');
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const [editGroup, setEditGroup] = useState(null);
  const [groupFormData, setGroupFormData] = useState({
    name: '',
    description: '',
    permissions: [],
  });

  // Sessions state
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState('');
  const [sessionPage, setSessionPage] = useState(0);
  const [sessionRowsPerPage, setSessionRowsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchGroups();
    fetchSessions();
  }, []);

  // Users functions
  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data.users || []);
      setUsersError('');
    } catch (err) {
      setUsersError('Failed to fetch users');
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      await api.post('/api/admin/users', userFormData);
      setOpenUserDialog(false);
      setUserFormData({ email: '', password: '', full_name: '', role: 'student' });
      fetchUsers();
    } catch (err) {
      setUsersError(err.response?.data?.detail || 'Failed to create user');
    }
  };

  const handleUpdateUser = async (userId) => {
    try {
      const updateData = {
        full_name: userFormData.full_name,
        role: userFormData.role,
        is_active: userFormData.is_active,
      };
      await api.put(`/api/admin/users/${userId}`, updateData);
      setOpenUserDialog(false);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      setUsersError(err.response?.data?.detail || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/api/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      setUsersError(err.response?.data?.detail || 'Failed to delete user');
    }
  };

  const openCreateUserDialog = () => {
    setEditUser(null);
    setUserFormData({ email: '', password: '', full_name: '', role: 'student' });
    setOpenUserDialog(true);
  };

  const openEditUserDialog = (user) => {
    setEditUser(user);
    setUserFormData({
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      is_active: user.is_active,
    });
    setOpenUserDialog(true);
  };

  // Roles functions
  const fetchRoles = async () => {
    try {
      const response = await api.get('/api/admin/roles');
      setRoles(response.data.roles || []);
      setRolesError('');
    } catch (err) {
      setRolesError('Failed to fetch roles');
      console.error(err);
    } finally {
      setRolesLoading(false);
    }
  };

  const handleCreateRole = async () => {
    try {
      await api.post('/api/admin/roles', roleFormData);
      setOpenRoleDialog(false);
      setRoleFormData({ name: '', description: '', permissions: [] });
      fetchRoles();
    } catch (err) {
      setRolesError(err.response?.data?.detail || 'Failed to create role');
    }
  };

  const handleUpdateRole = async (roleId) => {
    try {
      await api.put(`/api/admin/roles/${roleId}`, {
        permissions: roleFormData.permissions,
        description: roleFormData.description,
      });
      setOpenRoleDialog(false);
      setEditRole(null);
      fetchRoles();
    } catch (err) {
      setRolesError(err.response?.data?.detail || 'Failed to update role');
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    try {
      await api.delete(`/api/admin/roles/${roleId}`);
      fetchRoles();
    } catch (err) {
      setRolesError(err.response?.data?.detail || 'Failed to delete role');
    }
  };

  const openCreateRoleDialog = () => {
    setEditRole(null);
    setRoleFormData({ name: '', description: '', permissions: [] });
    setOpenRoleDialog(true);
  };

  const openEditRoleDialog = (role) => {
    setEditRole(role);
    const perms = typeof role.permissions === 'string' ? JSON.parse(role.permissions) : role.permissions;
    setRoleFormData({
      name: role.name,
      description: role.description,
      permissions: perms,
    });
    setOpenRoleDialog(true);
  };

  // Groups functions
  const fetchGroups = async () => {
    try {
      const response = await api.get('/api/admin/groups');
      setGroups(response.data.groups || []);
      setGroupsError('');
    } catch (err) {
      setGroupsError('Failed to fetch groups');
      console.error(err);
    } finally {
      setGroupsLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    try {
      await api.post('/api/admin/groups', groupFormData);
      setOpenGroupDialog(false);
      setGroupFormData({ name: '', description: '', permissions: [] });
      fetchGroups();
    } catch (err) {
      setGroupsError(err.response?.data?.detail || 'Failed to create group');
    }
  };

  const handleUpdateGroup = async (groupId) => {
    try {
      await api.put(`/api/admin/groups/${groupId}`, {
        permissions: groupFormData.permissions,
        description: groupFormData.description,
      });
      setOpenGroupDialog(false);
      setEditGroup(null);
      fetchGroups();
    } catch (err) {
      setGroupsError(err.response?.data?.detail || 'Failed to update group');
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!confirm('Are you sure you want to delete this group?')) return;
    try {
      await api.delete(`/api/admin/groups/${groupId}`);
      fetchGroups();
    } catch (err) {
      setGroupsError(err.response?.data?.detail || 'Failed to delete group');
    }
  };

  const openCreateGroupDialog = () => {
    setEditGroup(null);
    setGroupFormData({ name: '', description: '', permissions: [] });
    setOpenGroupDialog(true);
  };

  const openEditGroupDialog = (group) => {
    setEditGroup(group);
    const perms = typeof group.permissions === 'string' ? JSON.parse(group.permissions) : group.permissions;
    setGroupFormData({
      name: group.name,
      description: group.description,
      permissions: perms,
    });
    setOpenGroupDialog(true);
  };

  // Sessions functions
  const fetchSessions = async () => {
    try {
      const response = await api.get('/api/admin/sessions');
      setSessions(response.data.sessions || []);
      setSessionsError('');
    } catch (err) {
      setSessionsError('Failed to fetch sessions');
      console.error(err);
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    if (!confirm('Are you sure you want to revoke this session?')) return;
    try {
      await api.delete(`/api/admin/sessions/${sessionId}`);
      fetchSessions();
    } catch (err) {
      setSessionsError(err.response?.data?.detail || 'Failed to revoke session');
    }
  };

  const getDeviceIcon = (userAgent) => {
    if (!userAgent) return <Computer />;
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return <Smartphone />;
    }
    return <Computer />;
  };

  if (usersLoading || rolesLoading || groupsLoading || sessionsLoading) {
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
      <SEO 
        title="User Management - Admin Panel"
        description="Manage users, roles, groups, and sessions for your learning management system. Comprehensive user administration and access control."
        keywords="user management, role management, group management, session management, access control, LMS administration"
        url="https://lms-platform.com/admin/users"
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography 
          variant="h4"
          sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}
        >
          User Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {tabValue === 0 && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={openCreateUserDialog}
            >
              Create User
            </Button>
          )}
          {tabValue === 1 && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={openCreateRoleDialog}
            >
              Create Role
            </Button>
          )}
          {tabValue === 2 && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={openCreateGroupDialog}
            >
              Create Group
            </Button>
          )}
        </Box>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage users, roles, groups, and active sessions
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Users" />
          <Tab label="Roles" />
          <Tab label="Groups" />
          <Tab label="Sessions" />
        </Tabs>
      </Box>

      {/* Users Tab */}
      <TabPanel value={tabValue} index={0}>
        {usersError && <Alert severity="error" sx={{ mb: 2 }}>{usersError}</Alert>}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Verified</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.slice(userPage * userRowsPerPage, userPage * userRowsPerPage + userRowsPerPage).map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.full_name || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={user.role === 'admin' ? 'error' : user.role === 'instructor' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {user.is_active ? (
                      <Chip icon={<CheckCircle />} label="Active" color="success" size="small" />
                    ) : (
                      <Chip icon={<Block />} label="Inactive" color="default" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    {user.is_verified ? (
                      <Chip icon={<CheckCircle />} label="Verified" color="success" size="small" />
                    ) : (
                      <Chip icon={<Cancel />} label="Not Verified" color="warning" size="small" />
                    )}
                  </TableCell>
                  <TableCell>{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEditUserDialog(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteUser(user.id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={users.length}
            page={userPage}
            onPageChange={(e, newPage) => setUserPage(newPage)}
            rowsPerPage={userRowsPerPage}
            onRowsPerPageChange={(e) => {
              setUserRowsPerPage(parseInt(e.target.value, 10));
              setUserPage(0);
            }}
          />
        </TableContainer>
      </TabPanel>

      {/* Roles Tab */}
      <TabPanel value={tabValue} index={1}>
        {rolesError && <Alert severity="error" sx={{ mb: 2 }}>{rolesError}</Alert>}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => {
                const perms = typeof role.permissions === 'string' ? JSON.parse(role.permissions) : role.permissions;
                return (
                  <TableRow key={role.id}>
                    <TableCell>{role.id}</TableCell>
                    <TableCell>
                      <Chip label={role.name} color="primary" size="small" />
                    </TableCell>
                    <TableCell>{role.description || '-'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {perms.slice(0, 3).map((perm, idx) => (
                          <Chip key={idx} label={perm} size="small" variant="outlined" />
                        ))}
                        {perms.length > 3 && <Chip label={`+${perms.length - 3}`} size="small" />}
                      </Box>
                    </TableCell>
                    <TableCell>{role.created_at ? new Date(role.created_at).toLocaleDateString() : '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => openEditRoleDialog(role)}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteRole(role.id)} color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Groups Tab */}
      <TabPanel value={tabValue} index={2}>
        {groupsError && <Alert severity="error" sx={{ mb: 2 }}>{groupsError}</Alert>}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group) => {
                const perms = typeof group.permissions === 'string' ? JSON.parse(group.permissions) : group.permissions;
                return (
                  <TableRow key={group.id}>
                    <TableCell>{group.id}</TableCell>
                    <TableCell>
                      <Chip label={group.name} color="secondary" size="small" />
                    </TableCell>
                    <TableCell>{group.description || '-'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {perms.slice(0, 3).map((perm, idx) => (
                          <Chip key={idx} label={perm} size="small" variant="outlined" />
                        ))}
                        {perms.length > 3 && <Chip label={`+${perms.length - 3}`} size="small" />}
                      </Box>
                    </TableCell>
                    <TableCell>{group.created_at ? new Date(group.created_at).toLocaleDateString() : '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => openEditGroupDialog(group)}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteGroup(group.id)} color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Sessions Tab */}
      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" sx={{ mb: 3 }}>Active User Sessions</Typography>

        {sessionsError && <Alert severity="error" sx={{ mb: 2 }}>{sessionsError}</Alert>}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Session ID</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Device</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Expires At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.slice(sessionPage * sessionRowsPerPage, sessionPage * sessionRowsPerPage + sessionRowsPerPage).map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.id}</TableCell>
                  <TableCell>{session.user_id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getDeviceIcon(session.user_agent)}
                      <Typography variant="body2">{session.device_info || 'Unknown'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{session.ip || '-'}</TableCell>
                  <TableCell>
                    {session.revoked ? (
                      <Chip label="Revoked" color="error" size="small" />
                    ) : new Date(session.expires_at) > new Date() ? (
                      <Chip label="Active" color="success" size="small" />
                    ) : (
                      <Chip label="Expired" color="default" size="small" />
                    )}
                  </TableCell>
                  <TableCell>{session.created_at ? new Date(session.created_at).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>{session.expires_at ? new Date(session.expires_at).toLocaleDateString() : '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      onClick={() => handleRevokeSession(session.id)} 
                      color="error"
                      disabled={session.revoked}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={sessions.length}
            page={sessionPage}
            onPageChange={(e, newPage) => setSessionPage(newPage)}
            rowsPerPage={sessionRowsPerPage}
            onRowsPerPageChange={(e) => {
              setSessionRowsPerPage(parseInt(e.target.value, 10));
              setSessionPage(0);
            }}
          />
        </TableContainer>
      </TabPanel>

      {/* User Create/Edit Dialog */}
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editUser ? 'Edit User' : 'Create New User'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email"
            value={userFormData.email}
            onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
            margin="normal"
            disabled={!!editUser}
          />
          {!editUser && (
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={userFormData.password}
              onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
              margin="normal"
            />
          )}
          <TextField
            fullWidth
            label="Full Name"
            value={userFormData.full_name}
            onChange={(e) => setUserFormData({ ...userFormData, full_name: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={userFormData.role}
              onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="instructor">Instructor</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => editUser ? handleUpdateUser(editUser.id) : handleCreateUser()}
          >
            {editUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Role Create/Edit Dialog */}
      <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Role Name"
            value={roleFormData.name}
            onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
            margin="normal"
            disabled={!!editRole}
          />
          <TextField
            fullWidth
            label="Description"
            value={roleFormData.description}
            onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Permissions</InputLabel>
            <Select
              multiple
              value={roleFormData.permissions}
              onChange={(e) => setRoleFormData({ ...roleFormData, permissions: e.target.value })}
              input={<OutlinedInput label="Permissions" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {AVAILABLE_PERMISSIONS.map((permission) => (
                <MenuItem key={permission} value={permission}>
                  {permission}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoleDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => editRole ? handleUpdateRole(editRole.id) : handleCreateRole()}
          >
            {editRole ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Group Create/Edit Dialog */}
      <Dialog open={openGroupDialog} onClose={() => setOpenGroupDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editGroup ? 'Edit Group' : 'Create New Group'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Group Name"
            value={groupFormData.name}
            onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
            margin="normal"
            disabled={!!editGroup}
          />
          <TextField
            fullWidth
            label="Description"
            value={groupFormData.description}
            onChange={(e) => setGroupFormData({ ...groupFormData, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Permissions</InputLabel>
            <Select
              multiple
              value={groupFormData.permissions}
              onChange={(e) => setGroupFormData({ ...groupFormData, permissions: e.target.value })}
              input={<OutlinedInput label="Permissions" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {AVAILABLE_PERMISSIONS.map((permission) => (
                <MenuItem key={permission} value={permission}>
                  {permission}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGroupDialog(false)}>Cancel</Button>
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
