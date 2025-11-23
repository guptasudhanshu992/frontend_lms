import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  TextField,
  Box,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  InputAdornment,
  Paper,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  Lock,
  Email,
  Person,
  Verified,
  CalendarMonth,
  Shield,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import SEO from '../components/SEO';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [fullName, setFullName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  // Dialog states
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  // Password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Email change form
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/profile/me');
      setProfile(response.data);
      setFullName(response.data.full_name || '');
      setProfilePicture(response.data.profile_picture || '');
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await api.put('/api/profile/me', {
        full_name: fullName,
        profile_picture: profilePicture,
      });

      setSuccess('Profile updated successfully!');
      setEditing(false);
      await fetchProfile();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setFullName(profile?.full_name || '');
    setProfilePicture(profile?.profile_picture || '');
    setError('');
  };

  const handleChangePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }

      setError('');
      setSuccess('');
      setSaving(true);

      await api.post('/api/profile/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });

      setSuccess('Password changed successfully!');
      setPasswordDialogOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.detail || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleChangeEmail = async () => {
    try {
      setError('');
      setSuccess('');
      setSaving(true);

      await api.post('/api/profile/change-email', {
        new_email: newEmail,
        password: emailPassword,
      });

      setSuccess('Email changed successfully! Please verify your new email.');
      setEmailDialogOpen(false);
      setNewEmail('');
      setEmailPassword('');
      await fetchProfile();
      
      // Logout user to re-login with new email
      setTimeout(async () => {
        await logout();
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      console.error('Error changing email:', err);
      setError(err.response?.data?.detail || 'Failed to change email');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return profile?.email?.charAt(0).toUpperCase() || 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load profile</Alert>
      </Container>
    );
  }

  return (
    <>
      <SEO
        title="My Profile - Account Settings"
        description="Manage your account settings, update profile information, and change password"
      />
      <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          {/* Alerts */}
          {error && (
            <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {/* Profile Header Card */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={profile.profile_picture}
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: '2.5rem',
                      bgcolor: 'primary.main',
                      boxShadow: 3,
                    }}
                  >
                    {getInitials(profile.full_name)}
                  </Avatar>
                  {editing && (
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                      }}
                    >
                      <PhotoCamera />
                    </IconButton>
                  )}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h4" fontWeight="bold">
                      {profile.full_name || 'User'}
                    </Typography>
                    {profile.is_verified && (
                      <Verified color="primary" titleAccess="Verified Account" />
                    )}
                  </Box>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {profile.email}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Chip
                      label={profile.role}
                      size="small"
                      color="primary"
                      variant="outlined"
                      icon={<Shield />}
                    />
                    <Chip
                      label={profile.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      color={profile.is_active ? 'success' : 'default'}
                    />
                  </Stack>
                </Box>

                {!editing ? (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      {saving ? <CircularProgress size={20} /> : 'Save'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancelEdit}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </Stack>
                )}
              </Box>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Stack spacing={3}>
                    <TextField
                      label="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={!editing}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      label="Email Address"
                      value={profile.email}
                      disabled
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {editing && (
                      <TextField
                        label="Profile Picture URL"
                        value={profilePicture}
                        onChange={(e) => setProfilePicture(e.target.value)}
                        fullWidth
                        placeholder="https://example.com/photo.jpg"
                      />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Account Details */}
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Account Details
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Member Since
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <CalendarMonth fontSize="small" color="action" />
                        <Typography variant="body2">{formatDate(profile.created_at)}</Typography>
                      </Box>
                    </Box>

                    {profile.last_login && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Last Login
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <CalendarMonth fontSize="small" color="action" />
                          <Typography variant="body2">{formatDate(profile.last_login)}</Typography>
                        </Box>
                      </Box>
                    )}

                    {profile.oauth_provider && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Sign-in Method
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {profile.oauth_provider} (OAuth)
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Security Settings */}
            <Grid item xs={12}>
              <Card elevation={2}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Security Settings
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Stack spacing={2}>
                    {!profile.oauth_provider && (
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="600">
                              Password
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Change your password to keep your account secure
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            startIcon={<Lock />}
                            onClick={() => setPasswordDialogOpen(true)}
                          >
                            Change Password
                          </Button>
                        </Box>
                      </Paper>
                    )}

                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600">
                            Email Address
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Update your email address for account notifications
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          startIcon={<Email />}
                          onClick={() => setEmailDialogOpen(true)}
                          disabled={!!profile.oauth_provider}
                        >
                          Change Email
                        </Button>
                      </Box>
                    </Paper>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Change Password Dialog */}
          <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
              <Stack spacing={3} sx={{ mt: 2 }}>
                <TextField
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                  required
                  helperText="Must be at least 8 characters"
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  required
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={() => setPasswordDialogOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleChangePassword}
                disabled={saving || !currentPassword || !newPassword || !confirmPassword}
              >
                {saving ? <CircularProgress size={20} /> : 'Change Password'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Change Email Dialog */}
          <Dialog open={emailDialogOpen} onClose={() => setEmailDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Change Email Address</DialogTitle>
            <DialogContent>
              <Stack spacing={3} sx={{ mt: 2 }}>
                <Alert severity="info">
                  You will be logged out and need to verify your new email address.
                </Alert>
                <TextField
                  label="New Email Address"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  fullWidth
                  required
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={() => setEmailDialogOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleChangeEmail}
                disabled={saving || !newEmail || !emailPassword}
              >
                {saving ? <CircularProgress size={20} /> : 'Change Email'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  );
}
