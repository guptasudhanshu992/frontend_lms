import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  LocalOffer
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api';
import { format } from 'date-fns';

export default function CouponManagement() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    max_discount: '',
    max_uses: '',
    max_uses_per_user: 1,
    is_active: true,
    valid_from: null,
    valid_until: null,
    course_id: null
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/payments/admin/coupons');
      setCoupons(response.data);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        description: coupon.description || '',
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        max_discount: coupon.max_discount || '',
        max_uses: coupon.max_uses || '',
        max_uses_per_user: coupon.max_uses_per_user,
        is_active: coupon.is_active,
        valid_from: coupon.valid_from ? new Date(coupon.valid_from) : null,
        valid_until: coupon.valid_until ? new Date(coupon.valid_until) : null,
        course_id: coupon.course_id || null
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '',
        max_discount: '',
        max_uses: '',
        max_uses_per_user: 1,
        is_active: true,
        valid_from: null,
        valid_until: null,
        course_id: null
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      setError('');
      
      const payload = {
        ...formData,
        discount_value: parseFloat(formData.discount_value),
        max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        course_id: formData.course_id || null
      };

      if (editingCoupon) {
        await api.put(`/api/payments/admin/coupons/${editingCoupon.id}`, {
          description: payload.description,
          is_active: payload.is_active,
          max_uses: payload.max_uses,
          valid_until: payload.valid_until
        });
        setSuccess('Coupon updated successfully');
      } else {
        await api.post('/api/payments/admin/coupons', payload);
        setSuccess('Coupon created successfully');
      }

      setOpenDialog(false);
      fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await api.delete(`/api/payments/admin/coupons/${id}`);
      setSuccess('Coupon deleted successfully');
      fetchCoupons();
    } catch (err) {
      setError('Failed to delete coupon');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          Coupon Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Create Coupon
        </Button>
      </Box>

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

      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Usage</TableCell>
                <TableCell>Valid Until</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalOffer sx={{ mr: 1, color: 'primary.main' }} fontSize="small" />
                      <Typography variant="body2" fontWeight="bold">
                        {coupon.code}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{coupon.description || '-'}</TableCell>
                  <TableCell>
                    {coupon.discount_type === 'percentage'
                      ? `${coupon.discount_value}%`
                      : `$${coupon.discount_value}`}
                    {coupon.max_discount && ` (max $${coupon.max_discount})`}
                  </TableCell>
                  <TableCell>
                    {coupon.used_count} / {coupon.max_uses || '∞'}
                  </TableCell>
                  <TableCell>
                    {coupon.valid_until
                      ? format(new Date(coupon.valid_until), 'MMM dd, yyyy')
                      : 'No expiry'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={coupon.is_active ? 'Active' : 'Inactive'}
                      color={coupon.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(coupon)}
                      color="primary"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(coupon.id)}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Coupon Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Coupon Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            margin="normal"
            required
            disabled={!!editingCoupon}
            helperText="Must be unique"
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

          <TextField
            select
            fullWidth
            label="Discount Type"
            value={formData.discount_type}
            onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
            margin="normal"
            required
            disabled={!!editingCoupon}
          >
            <MenuItem value="percentage">Percentage</MenuItem>
            <MenuItem value="fixed">Fixed Amount</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Discount Value"
            type="number"
            value={formData.discount_value}
            onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
            margin="normal"
            required
            disabled={!!editingCoupon}
            helperText={
              formData.discount_type === 'percentage'
                ? 'Enter percentage (e.g., 20 for 20%)'
                : 'Enter fixed amount in dollars'
            }
          />

          {formData.discount_type === 'percentage' && (
            <TextField
              fullWidth
              label="Maximum Discount ($)"
              type="number"
              value={formData.max_discount}
              onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
              margin="normal"
              helperText="Optional: Set a maximum discount amount"
            />
          )}

          <TextField
            fullWidth
            label="Maximum Uses"
            type="number"
            value={formData.max_uses}
            onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
            margin="normal"
            helperText="Leave empty for unlimited uses"
          />

          <TextField
            fullWidth
            label="Max Uses Per User"
            type="number"
            value={formData.max_uses_per_user}
            onChange={(e) => setFormData({ ...formData, max_uses_per_user: parseInt(e.target.value) })}
            margin="normal"
            required
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Valid From"
              value={formData.valid_from}
              onChange={(date) => setFormData({ ...formData, valid_from: date })}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />

            <DateTimePicker
              label="Valid Until"
              value={formData.valid_until}
              onChange={(date) => setFormData({ ...formData, valid_until: date })}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </LocalizationProvider>

          <TextField
            select
            fullWidth
            label="Status"
            value={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
            margin="normal"
          >
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.code || !formData.discount_value}
          >
            {editingCoupon ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}
