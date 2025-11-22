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
  Chip,
  CircularProgress,
  Alert,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterAction, setFilterAction] = useState('');
  const [filterUserId, setFilterUserId] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [filterAction, filterUserId]);

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (filterAction) params.append('action', filterAction);
      if (filterUserId) params.append('user_id', filterUserId);
      
      const response = await api.get(`/api/admin/audit-logs?${params}`);
      setLogs(response.data.logs || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch audit logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    if (action.includes('create') || action.includes('register')) return 'success';
    if (action.includes('delete')) return 'error';
    if (action.includes('update') || action.includes('modify')) return 'warning';
    if (action.includes('login')) return 'info';
    return 'default';
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
        Audit Logs
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Track all system activities and user actions
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Filter by User ID"
            value={filterUserId}
            onChange={(e) => setFilterUserId(e.target.value)}
            size="small"
            sx={{ width: 200 }}
          />
          <FormControl size="small" sx={{ width: 200 }}>
            <InputLabel>Filter by Action</InputLabel>
            <Select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              label="Filter by Action"
            >
              <MenuItem value="">All Actions</MenuItem>
              <MenuItem value="user.register">User Register</MenuItem>
              <MenuItem value="auth.login">Auth Login</MenuItem>
              <MenuItem value="auth.logout">Auth Logout</MenuItem>
              <MenuItem value="user.update">User Update</MenuItem>
              <MenuItem value="user.delete">User Delete</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>User Agent</TableCell>
              <TableCell>Metadata</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.id}</TableCell>
                <TableCell>{log.user_id || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={log.action}
                    color={getActionColor(log.action)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{log.ip_address || '-'}</TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>
                    {log.user_agent || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {log.meta ? JSON.stringify(log.meta).substring(0, 50) + '...' : '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={logs.length}
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
