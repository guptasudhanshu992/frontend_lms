import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Speed,
  CheckCircle,
  Error as ErrorIcon,
  People,
  Public,
  Refresh,
  Timeline,
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const APIAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [interval, setInterval] = useState('day');
  
  // Data states
  const [overview, setOverview] = useState(null);
  const [endpoints, setEndpoints] = useState([]);
  const [geography, setGeography] = useState({ countries: [], cities: [] });
  const [performance, setPerformance] = useState([]);
  const [errors, setErrors] = useState({ by_status_code: [], by_endpoint: [], recent_errors: [] });
  const [slowestEndpoints, setSlowestEndpoints] = useState([]);
  const [comparison, setComparison] = useState(null);

  useEffect(() => {
    fetchAllAnalytics();
    // Auto-refresh every 30 seconds
    const intervalId = setInterval(fetchAllAnalytics, 30000);
    return () => clearInterval(intervalId);
  }, [timeRange, interval]);

  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    
    switch (timeRange) {
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

  const fetchAllAnalytics = async () => {
    setLoading(true);
    try {
      const dateRange = getDateRange();
      
      const [
        overviewRes,
        endpointsRes,
        geographyRes,
        performanceRes,
        errorsRes,
        slowestRes,
        comparisonRes,
      ] = await Promise.all([
        api.get('/api/analytics/overview', { params: dateRange }),
        api.get('/api/analytics/endpoints', { params: { ...dateRange, limit: 20 } }),
        api.get('/api/analytics/geography', { params: { ...dateRange, limit: 50 } }),
        api.get('/api/analytics/performance', { params: { ...dateRange, interval } }),
        api.get('/api/analytics/errors', { params: { ...dateRange, limit: 50 } }),
        api.get('/api/analytics/slowest', { params: { ...dateRange, limit: 10 } }),
        api.get('/api/analytics/stats/comparison', { params: { period: 'day' } }),
      ]);

      setOverview(overviewRes.data);
      setEndpoints(endpointsRes.data.endpoints);
      setGeography(geographyRes.data);
      setPerformance(performanceRes.data.timeline);
      setErrors(errorsRes.data);
      setSlowestEndpoints(slowestRes.data.slowest_endpoints);
      setComparison(comparisonRes.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue }) => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                {trend === 'up' ? (
                  <TrendingUp color="success" fontSize="small" />
                ) : (
                  <TrendingDown color="error" fontSize="small" />
                )}
                <Typography
                  variant="body2"
                  color={trend === 'up' ? 'success.main' : 'error.main'}
                  ml={0.5}
                >
                  {trendValue}
                </Typography>
              </Box>
            )}
          </Box>
          {Icon && (
            <Box
              sx={{
                backgroundColor: 'primary.main',
                borderRadius: 2,
                p: 1,
                color: 'white',
              }}
            >
              <Icon />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const formatDuration = (ms) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getStatusColor = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) return 'success';
    if (statusCode >= 300 && statusCode < 400) return 'info';
    if (statusCode >= 400 && statusCode < 500) return 'warning';
    return 'error';
  };

  if (loading && !overview) {
    return (
      <AdminLayout>
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress />
          <Typography align="center" sx={{ mt: 2 }}>
            Loading analytics...
          </Typography>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" gutterBottom>
              API Analytics
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Monitor API performance, usage patterns, and geographic distribution
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value)}
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
                value={interval}
                label="Interval"
                onChange={(e) => setInterval(e.target.value)}
              >
                <MenuItem value="hour">Hourly</MenuItem>
                <MenuItem value="day">Daily</MenuItem>
                <MenuItem value="week">Weekly</MenuItem>
              </Select>
            </FormControl>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchAllAnalytics} color="primary">
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Overview Stats */}
        {overview && (
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Requests"
                value={overview.total_requests.toLocaleString()}
                subtitle={`${overview.requests_per_minute.toFixed(2)} req/min`}
                icon={Timeline}
                trend={comparison?.changes?.total_requests > 0 ? 'up' : 'down'}
                trendValue={`${Math.abs(comparison?.changes?.total_requests || 0).toFixed(1)}%`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Avg Response Time"
                value={formatDuration(overview.avg_response_time)}
                icon={Speed}
                trend={comparison?.changes?.avg_response_time < 0 ? 'up' : 'down'}
                trendValue={`${Math.abs(comparison?.changes?.avg_response_time || 0).toFixed(1)}%`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Success Rate"
                value={`${overview.success_rate.toFixed(1)}%`}
                subtitle={`${overview.error_rate.toFixed(1)}% errors`}
                icon={CheckCircle}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Unique Users"
                value={overview.unique_users.toLocaleString()}
                subtitle={`${overview.unique_ips} IPs`}
                icon={People}
              />
            </Grid>
          </Grid>
        )}

        {/* Performance Timeline */}
        {performance.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="request_count"
                    stroke="#8884d8"
                    name="Requests"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avg_response_time"
                    stroke="#82ca9d"
                    name="Avg Response Time (ms)"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="error_count"
                    stroke="#ff7300"
                    name="Errors"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <Grid container spacing={3}>
          {/* Top Endpoints */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Endpoints
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Endpoint</TableCell>
                        <TableCell>Method</TableCell>
                        <TableCell align="right">Requests</TableCell>
                        <TableCell align="right">Avg Time</TableCell>
                        <TableCell align="right">Success Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {endpoints.slice(0, 10).map((endpoint, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                              {endpoint.endpoint}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={endpoint.method} size="small" color="primary" />
                          </TableCell>
                          <TableCell align="right">{endpoint.request_count}</TableCell>
                          <TableCell align="right">
                            {formatDuration(endpoint.avg_response_time)}
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${endpoint.success_rate.toFixed(1)}%`}
                              size="small"
                              color={endpoint.success_rate > 95 ? 'success' : 'warning'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Slowest Endpoints */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Slowest Endpoints
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Endpoint</TableCell>
                        <TableCell>Method</TableCell>
                        <TableCell align="right">Avg Time</TableCell>
                        <TableCell align="right">Max Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {slowestEndpoints.map((endpoint, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                              {endpoint.endpoint}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={endpoint.method} size="small" />
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              color={endpoint.avg_response_time > 1000 ? 'error' : 'inherit'}
                            >
                              {formatDuration(endpoint.avg_response_time)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            {formatDuration(endpoint.max_response_time)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Geographic Distribution - Countries */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Countries
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={geography.countries.slice(0, 6)}
                      dataKey="request_count"
                      nameKey="country"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.country}: ${entry.request_count}`}
                    >
                      {geography.countries.slice(0, 6).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Geographic Distribution - Cities */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Cities
                </Typography>
                <TableContainer sx={{ maxHeight: 300 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>City</TableCell>
                        <TableCell>Country</TableCell>
                        <TableCell align="right">Requests</TableCell>
                        <TableCell align="right">Avg Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {geography.cities.slice(0, 10).map((city, index) => (
                        <TableRow key={index}>
                          <TableCell>{city.city}</TableCell>
                          <TableCell>{city.country}</TableCell>
                          <TableCell align="right">{city.request_count}</TableCell>
                          <TableCell align="right">
                            {formatDuration(city.avg_response_time)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Error Analysis */}
          {errors.by_status_code.length > 0 && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Errors by Status Code
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={errors.by_status_code}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status_code" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="count" fill="#ff7300" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Recent Errors */}
          {errors.recent_errors.length > 0 && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Errors
                  </Typography>
                  <TableContainer sx={{ maxHeight: 250 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Endpoint</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Time</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {errors.recent_errors.slice(0, 5).map((error) => (
                          <TableRow key={error.id}>
                            <TableCell>
                              <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                {error.method} {error.endpoint}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={error.status_code}
                                size="small"
                                color={getStatusColor(error.status_code)}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="textSecondary">
                                {new Date(error.created_at).toLocaleString()}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </AdminLayout>
  );
};

export default APIAnalytics;
