import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  MenuItem,
  TablePagination,
  Select,
  FormControl,
  InputLabel,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  AttachMoney,
  ShoppingCart,
  TrendingUp,
  Refresh,
  Visibility,
  CheckCircle,
  Cancel,
  ErrorOutline,
  Add,
  Edit,
  Delete,
  LocalOffer,
  History,
  BarChart,
  TrendingDown,
  Speed,
  Error as ErrorIcon2,
  People,
  Public,
  Timeline,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api';
import { format } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function PaymentManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  
  // Audit Logs state
  const [logs, setLogs] = useState([]);
  const [logsPage, setLogsPage] = useState(0);
  const [logsRowsPerPage, setLogsRowsPerPage] = useState(10);
  const [filterAction, setFilterAction] = useState('');
  const [filterUserId, setFilterUserId] = useState('');
  
  // Analytics state
  const [analyticsTimeRange, setAnalyticsTimeRange] = useState('7d');
  const [analyticsInterval, setAnalyticsInterval] = useState('day');
  const [analyticsOverview, setAnalyticsOverview] = useState(null);
  const [analyticsEndpoints, setAnalyticsEndpoints] = useState([]);
  const [analyticsGeography, setAnalyticsGeography] = useState({ countries: [], cities: [] });
  const [analyticsPerformance, setAnalyticsPerformance] = useState([]);
  const [analyticsErrors, setAnalyticsErrors] = useState({ by_status_code: [], by_endpoint: [], recent_errors: [] });
  const [slowestEndpoints, setSlowestEndpoints] = useState([]);
  
  // Dialog states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [openRefundDialog, setOpenRefundDialog] = useState(false);
  const [openCouponDialog, setOpenCouponDialog] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [refundReason, setRefundReason] = useState('');
  const [refunding, setRefunding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [couponFormData, setCouponFormData] = useState({
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
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 2) {
      fetchAuditLogs();
    } else if (activeTab === 3) {
      fetchAnalytics();
    }
  }, [activeTab, filterAction, filterUserId, analyticsTimeRange, analyticsInterval]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsResponse, ordersResponse, couponsResponse] = await Promise.all([
        api.get('/api/payments/admin/stats'),
        api.get('/api/payments/admin/orders'),
        api.get('/api/payments/admin/coupons')
      ]);
      
      setStats(statsResponse.data);
      setOrders(ordersResponse.data);
      setCoupons(couponsResponse.data);
    } catch (err) {
      console.error('Error fetching payment data:', err);
      setError('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
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

  const getAnalyticsDateRange = () => {
    const end = new Date();
    const start = new Date();
    
    switch (analyticsTimeRange) {
      case '1h':
        start.setHours(end.getHours() - 1);
        break;
      case '24h':
        start.setHours(end.getHours() - 24);
        break;
      case '7d':
        start.setDate(end.getDate() - 7);
        break;
      case '30d':
        start.setDate(end.getDate() - 30);
        break;
      default:
        start.setDate(end.getDate() - 7);
    }
    
    return {
      start_date: start.toISOString(),
      end_date: end.toISOString(),
    };
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const dateRange = getAnalyticsDateRange();
      
      const [
        overviewRes,
        endpointsRes,
        geographyRes,
        performanceRes,
        errorsRes,
        slowestRes,
      ] = await Promise.all([
        api.get('/api/analytics/overview', { params: dateRange }),
        api.get('/api/analytics/endpoints', { params: { ...dateRange, limit: 20 } }),
        api.get('/api/analytics/geography', { params: { ...dateRange, limit: 50 } }),
        api.get('/api/analytics/performance', { params: { ...dateRange, interval: analyticsInterval } }),
        api.get('/api/analytics/errors', { params: { ...dateRange, limit: 50 } }),
        api.get('/api/analytics/slowest', { params: { ...dateRange, limit: 10 } }),
      ]);

      setAnalyticsOverview(overviewRes.data);
      setAnalyticsEndpoints(endpointsRes.data.endpoints);
      setAnalyticsGeography(geographyRes.data);
      setAnalyticsPerformance(performanceRes.data.timeline);
      setAnalyticsErrors(errorsRes.data);
      setSlowestEndpoints(slowestRes.data.slowest_endpoints);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenOrderDialog(true);
  };

  const handleOpenRefund = (order) => {
    setSelectedOrder(order);
    setRefundReason('');
    setOpenRefundDialog(true);
  };

  const handleRefund = async () => {
    if (!selectedOrder) return;
    
    setRefunding(true);
    setError('');
    try {
      await api.post('/api/payments/admin/refund', {
        order_id: selectedOrder.id,
        reason: refundReason
      });
      
      setSuccess('Refund processed successfully');
      setOpenRefundDialog(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process refund');
    } finally {
      setRefunding(false);
    }
  };

  // Coupon handlers
  const handleOpenCouponDialog = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setCouponFormData({
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
      setCouponFormData({
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
    setOpenCouponDialog(true);
  };

  const handleSubmitCoupon = async () => {
    try {
      setError('');
      
      const payload = {
        ...couponFormData,
        discount_value: parseFloat(couponFormData.discount_value),
        max_discount: couponFormData.max_discount ? parseFloat(couponFormData.max_discount) : null,
        max_uses: couponFormData.max_uses ? parseInt(couponFormData.max_uses) : null,
        course_id: couponFormData.course_id || null
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

      setOpenCouponDialog(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save coupon');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await api.delete(`/api/payments/admin/coupons/${id}`);
      setSuccess('Coupon deleted successfully');
      fetchData();
    } catch (err) {
      setError('Failed to delete coupon');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'refunded':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle fontSize="small" />;
      case 'pending':
        return <TrendingUp fontSize="small" />;
      case 'failed':
        return <ErrorOutline fontSize="small" />;
      case 'refunded':
        return <Cancel fontSize="small" />;
      default:
        return null;
    }
  };

  // Audit logs helper
  const getActionColor = (action) => {
    if (action.includes('create') || action.includes('register')) return 'success';
    if (action.includes('delete')) return 'error';
    if (action.includes('update') || action.includes('modify')) return 'warning';
    if (action.includes('login')) return 'info';
    return 'default';
  };

  // Analytics helpers
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDuration = (ms) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const StatCard = ({ title, value, icon, trend, color = 'primary' }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {trend > 0 ? (
                  <TrendingUp fontSize="small" color="success" />
                ) : (
                  <TrendingDown fontSize="small" color="error" />
                )}
                <Typography
                  variant="body2"
                  color={trend > 0 ? 'success.main' : 'error.main'}
                  sx={{ ml: 0.5 }}
                >
                  {Math.abs(trend)}%
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: `${color}.light`,
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h4">Analytics</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {activeTab === 1 && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenCouponDialog()}
            >
              Create Coupon
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchData}
          >
            Refresh
          </Button>
        </Box>
      </Box>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Monitor payments, coupons, system activity, and API performance
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Statistics Cards */}
      {stats && activeTab === 0 && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoney sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Revenue
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      ${stats.revenue.total_revenue.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ShoppingCart sx={{ fontSize: 32, color: 'success.main', mr: 1 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Orders
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {stats.revenue.total_orders}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle sx={{ fontSize: 32, color: 'info.main', mr: 1 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Successful
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {stats.revenue.successful_orders}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ fontSize: 32, color: 'warning.main', mr: 1 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Avg Order
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      ${stats.revenue.average_order_value.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab label="Orders" />
        <Tab label="Coupons" />
        <Tab label="Audit Logs" />
        <Tab label="API Analytics" />
      </Tabs>

      {/* Main Content */}
      <Paper elevation={2}>
        {/* Orders Tab */}
        {activeTab === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order #</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.order_number}</TableCell>
                  <TableCell>{order.user_email || 'N/A'}</TableCell>
                  <TableCell>{order.course_title || 'N/A'}</TableCell>
                  <TableCell>
                    ${order.total_amount.toFixed(2)} {order.currency}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                      icon={getStatusIcon(order.status)}
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleViewOrder(order)}
                      color="primary"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    {order.status === 'confirmed' && (
                      <Button
                        size="small"
                        onClick={() => handleOpenRefund(order)}
                        color="error"
                        sx={{ ml: 1 }}
                      >
                        Refund
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        )}

        {/* Coupons Tab */}
        {activeTab === 1 && (
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
                        onClick={() => handleOpenCouponDialog(coupon)}
                        color="primary"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCoupon(coupon.id)}
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
        )}

        {/* Audit Logs Tab */}
        {activeTab === 2 && (
          <Box>
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>User ID</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>IP Address</TableCell>
                    <TableCell>Metadata</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.slice(logsPage * logsRowsPerPage, logsPage * logsRowsPerPage + logsRowsPerPage).map((log) => (
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
                page={logsPage}
                onPageChange={(e, newPage) => setLogsPage(newPage)}
                rowsPerPage={logsRowsPerPage}
                onRowsPerPageChange={(e) => {
                  setLogsRowsPerPage(parseInt(e.target.value, 10));
                  setLogsPage(0);
                }}
              />
            </TableContainer>
          </Box>
        )}

        {/* API Analytics Tab */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            {/* Analytics Controls */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Time Range</InputLabel>
                  <Select
                    value={analyticsTimeRange}
                    label="Time Range"
                    onChange={(e) => setAnalyticsTimeRange(e.target.value)}
                  >
                    <MenuItem value="1h">Last Hour</MenuItem>
                    <MenuItem value="24h">Last 24 Hours</MenuItem>
                    <MenuItem value="7d">Last 7 Days</MenuItem>
                    <MenuItem value="30d">Last 30 Days</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Interval</InputLabel>
                  <Select
                    value={analyticsInterval}
                    label="Interval"
                    onChange={(e) => setAnalyticsInterval(e.target.value)}
                  >
                    <MenuItem value="hour">Hourly</MenuItem>
                    <MenuItem value="day">Daily</MenuItem>
                    <MenuItem value="week">Weekly</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <IconButton onClick={fetchAnalytics} color="primary">
                <Refresh />
              </IconButton>
            </Box>

            {/* Analytics Overview Cards */}
            {analyticsOverview && (
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Total Requests"
                    value={analyticsOverview.total_requests?.toLocaleString()}
                    icon={<Timeline />}
                    color="primary"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Avg Response Time"
                    value={formatDuration(analyticsOverview.avg_response_time)}
                    icon={<Speed />}
                    color="info"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Success Rate"
                    value={`${analyticsOverview.success_rate?.toFixed(1)}%`}
                    icon={<CheckCircle />}
                    color="success"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Unique Users"
                    value={analyticsOverview.unique_users?.toLocaleString()}
                    icon={<People />}
                    color="secondary"
                  />
                </Grid>
              </Grid>
            )}

            {/* Performance Timeline */}
            {analyticsPerformance && analyticsPerformance.length > 0 && (
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Performance Timeline
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="request_count" stroke="#8884d8" name="Requests" />
                    <Line yAxisId="right" type="monotone" dataKey="avg_response_time" stroke="#82ca9d" name="Avg Response Time (ms)" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            )}

            {/* Top Endpoints */}
            {analyticsEndpoints && analyticsEndpoints.length > 0 && (
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Top Endpoints
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Endpoint</TableCell>
                        <TableCell align="right">Requests</TableCell>
                        <TableCell align="right">Avg Response Time</TableCell>
                        <TableCell align="right">Success Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analyticsEndpoints.slice(0, 10).map((endpoint, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{endpoint.endpoint}</TableCell>
                          <TableCell align="right">{endpoint.request_count}</TableCell>
                          <TableCell align="right">{formatDuration(endpoint.avg_response_time)}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${endpoint.success_rate?.toFixed(1)}%`}
                              color={endpoint.success_rate > 95 ? 'success' : endpoint.success_rate > 90 ? 'warning' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {/* Geographic Distribution */}
            {analyticsGeography && analyticsGeography.countries && analyticsGeography.countries.length > 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Requests by Country
                    </Typography>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={analyticsGeography.countries.slice(0, 5)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.country}: ${entry.request_count}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="request_count"
                        >
                          {analyticsGeography.countries.slice(0, 5).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Top Cities
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>City</TableCell>
                            <TableCell align="right">Requests</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {analyticsGeography.cities.slice(0, 5).map((city, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{city.city}</TableCell>
                              <TableCell align="right">{city.request_count}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Box>
        )}
      </Paper>

      {/* Order Details Dialog */}
      <Dialog open={openOrderDialog} onClose={() => setOpenOrderDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Order Number</Typography>
                <Typography variant="body1" fontWeight="medium">{selectedOrder.order_number}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Customer</Typography>
                <Typography variant="body1" fontWeight="medium">{selectedOrder.user_email}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Course</Typography>
                <Typography variant="body1" fontWeight="medium">{selectedOrder.course_title}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Amount</Typography>
                <Typography variant="body1" fontWeight="medium">
                  ${selectedOrder.total_amount.toFixed(2)} {selectedOrder.currency}
                </Typography>
              </Box>
              {selectedOrder.discount_amount > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Discount</Typography>
                  <Typography variant="body1" fontWeight="medium" color="success.main">
                    -${selectedOrder.discount_amount.toFixed(2)}
                  </Typography>
                </Box>
              )}
              {selectedOrder.coupon_code && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Coupon Code</Typography>
                  <Typography variant="body1" fontWeight="medium">{selectedOrder.coupon_code}</Typography>
                </Box>
              )}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Chip
                  label={selectedOrder.status}
                  color={getStatusColor(selectedOrder.status)}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Created</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {format(new Date(selectedOrder.created_at), 'MMM dd, yyyy HH:mm')}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOrderDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={openRefundDialog} onClose={() => setOpenRefundDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Process Refund</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. The customer will be refunded the full amount.
          </Alert>
          {selectedOrder && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Order: {selectedOrder.order_number}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Amount: ${selectedOrder.total_amount.toFixed(2)}
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            label="Refund Reason (optional)"
            multiline
            rows={3}
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            placeholder="Enter reason for refund..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRefundDialog(false)} disabled={refunding}>
            Cancel
          </Button>
          <Button
            onClick={handleRefund}
            color="error"
            variant="contained"
            disabled={refunding}
          >
            {refunding ? <CircularProgress size={24} /> : 'Process Refund'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Coupon Dialog */}
      <Dialog open={openCouponDialog} onClose={() => setOpenCouponDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Coupon Code"
            value={couponFormData.code}
            onChange={(e) => setCouponFormData({ ...couponFormData, code: e.target.value.toUpperCase() })}
            margin="normal"
            required
            disabled={!!editingCoupon}
            helperText="Must be unique"
          />

          <TextField
            fullWidth
            label="Description"
            value={couponFormData.description}
            onChange={(e) => setCouponFormData({ ...couponFormData, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />

          <TextField
            select
            fullWidth
            label="Discount Type"
            value={couponFormData.discount_type}
            onChange={(e) => setCouponFormData({ ...couponFormData, discount_type: e.target.value })}
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
            value={couponFormData.discount_value}
            onChange={(e) => setCouponFormData({ ...couponFormData, discount_value: e.target.value })}
            margin="normal"
            required
            disabled={!!editingCoupon}
            helperText={
              couponFormData.discount_type === 'percentage'
                ? 'Enter percentage (e.g., 20 for 20%)'
                : 'Enter fixed amount in dollars'
            }
          />

          {couponFormData.discount_type === 'percentage' && (
            <TextField
              fullWidth
              label="Maximum Discount ($)"
              type="number"
              value={couponFormData.max_discount}
              onChange={(e) => setCouponFormData({ ...couponFormData, max_discount: e.target.value })}
              margin="normal"
              helperText="Optional: Set a maximum discount amount"
            />
          )}

          <TextField
            fullWidth
            label="Maximum Uses"
            type="number"
            value={couponFormData.max_uses}
            onChange={(e) => setCouponFormData({ ...couponFormData, max_uses: e.target.value })}
            margin="normal"
            helperText="Leave empty for unlimited uses"
          />

          <TextField
            fullWidth
            label="Max Uses Per User"
            type="number"
            value={couponFormData.max_uses_per_user}
            onChange={(e) => setCouponFormData({ ...couponFormData, max_uses_per_user: parseInt(e.target.value) })}
            margin="normal"
            required
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Valid From"
              value={couponFormData.valid_from}
              onChange={(date) => setCouponFormData({ ...couponFormData, valid_from: date })}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />

            <DateTimePicker
              label="Valid Until"
              value={couponFormData.valid_until}
              onChange={(date) => setCouponFormData({ ...couponFormData, valid_until: date })}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </LocalizationProvider>

          <TextField
            select
            fullWidth
            label="Status"
            value={couponFormData.is_active}
            onChange={(e) => setCouponFormData({ ...couponFormData, is_active: e.target.value === 'true' })}
            margin="normal"
          >
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCouponDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitCoupon}
            variant="contained"
            disabled={!couponFormData.code || !couponFormData.discount_value}
          >
            {editingCoupon ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}
