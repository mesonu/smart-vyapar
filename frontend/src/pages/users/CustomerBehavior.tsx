import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data for demonstration
const mockData = {
  metrics: {
    totalCustomers: 1500,
    activeCustomers: 1200,
    averageOrderValue: 2500,
    repeatPurchaseRate: 65,
  },
  purchaseFrequency: [
    { name: '1-2 times', value: 400 },
    { name: '3-5 times', value: 600 },
    { name: '6-10 times', value: 300 },
    { name: '10+ times', value: 200 },
  ],
  monthlySpending: [
    { name: 'Jan', value: 400000 },
    { name: 'Feb', value: 300000 },
    { name: 'Mar', value: 500000 },
    { name: 'Apr', value: 450000 },
    { name: 'May', value: 600000 },
    { name: 'Jun', value: 550000 },
  ],
  COLORS: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
};

const CustomerBehavior: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [timeRange, setTimeRange] = useState('6m');

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTimeRangeChange = (event: any) => {
    setTimeRange(event.target.value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Customer Behavior Analysis</Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="1m">Last Month</MenuItem>
            <MenuItem value="3m">Last 3 Months</MenuItem>
            <MenuItem value="6m">Last 6 Months</MenuItem>
            <MenuItem value="1y">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Key Metrics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Total Customers
                </Typography>
                <PeopleIcon color="primary" />
              </Box>
              <Typography variant="h4">{mockData.metrics.totalCustomers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Active Customers
                </Typography>
                <ShoppingCartIcon color="success" />
              </Box>
              <Typography variant="h4">{mockData.metrics.activeCustomers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Avg. Order Value
                </Typography>
                <TrendingUpIcon color="info" />
              </Box>
              <Typography variant="h4">
                ₹{mockData.metrics.averageOrderValue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Repeat Purchase Rate
                </Typography>
                <AccessTimeIcon color="warning" />
              </Box>
              <Typography variant="h4">{mockData.metrics.repeatPurchaseRate}%</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Spending Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Monthly Customer Spending</Typography>
              <IconButton onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
                <MenuItem onClick={handleMenuClose}>Export Data</MenuItem>
              </Menu>
            </Box>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockData.monthlySpending}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Purchase Frequency Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Purchase Frequency Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockData.purchaseFrequency}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockData.purchaseFrequency.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={mockData.COLORS[index % mockData.COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerBehavior; 