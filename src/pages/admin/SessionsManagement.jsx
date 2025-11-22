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
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  TablePagination,
} from '@mui/material';
import { Delete, Computer, Smartphone } from '@mui/icons-material';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api';

export default function SessionsManagement() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/api/admin/sessions');
      setSessions(response.data.sessions || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch sessions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    if (!confirm('Are you sure you want to revoke this session?')) return;
    
    try {
      await api.delete(`/api/admin/sessions/${sessionId}`);
      fetchSessions();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to revoke session');
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
      <Typography variant="h4" gutterBottom>
        Sessions Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage active user sessions
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
            {sessions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {session.id.substring(0, 8)}...
                  </Typography>
                </TableCell>
                <TableCell>{session.user_id}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getDeviceIcon(session.user_agent)}
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {session.user_agent || 'Unknown'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{session.ip_address || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={session.revoked ? 'Revoked' : 'Active'}
                    color={session.revoked ? 'default' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {session.created_at ? new Date(session.created_at).toLocaleString() : '-'}
                </TableCell>
                <TableCell>
                  {session.expires_at ? new Date(session.expires_at).toLocaleString() : '-'}
                </TableCell>
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
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    </AdminLayout>
  );
}
