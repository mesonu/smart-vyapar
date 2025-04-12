import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Paper,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  Payment as PaymentIcon,
  AccountBalance as AccountBalanceIcon,
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
} from 'recharts';

// Mock data for demonstration
const mockData = {
  monthlyRevenue: [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
  ],
  metrics: {
    totalRevenue: 1500000,
    pendingPayments: 250000,
    paidInvoices: 45,
    pendingInvoices: 12,
  },
};

const BillingDashboard: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Billing Overview
      </Typography>
      
      <Grid container spacing={3}>
        {/* Key Metrics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Total Revenue
                </Typography>
                <TrendingUpIcon color="primary" />
              </Box>
              <Typography variant="h4">
                ₹{mockData.metrics.totalRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Pending Payments
                </Typography>
                <PaymentIcon color="warning" />
              </Box>
              <Typography variant="h4">
                ₹{mockData.metrics.pendingPayments.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Paid Invoices
                </Typography>
                <ReceiptIcon color="success" />
              </Box>
              <Typography variant="h4">{mockData.metrics.paidInvoices}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Pending Invoices
                </Typography>
                <AccountBalanceIcon color="error" />
              </Box>
              <Typography variant="h4">{mockData.metrics.pendingInvoices}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Monthly Revenue</Typography>
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
                  data={mockData.monthlyRevenue}
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
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BillingDashboard; 