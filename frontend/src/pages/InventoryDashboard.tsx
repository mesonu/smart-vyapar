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
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data for demonstration
const mockData = {
  stockLevels: [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ],
  metrics: {
    totalProducts: 1250,
    lowStockItems: 45,
    outOfStockItems: 12,
    stockValue: 2500000,
  },
};

const InventoryDashboard: React.FC = () => {
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
        Inventory Overview
      </Typography>
      
      <Grid container spacing={3}>
        {/* Key Metrics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Total Products
                </Typography>
                <InventoryIcon color="primary" />
              </Box>
              <Typography variant="h4">{mockData.metrics.totalProducts}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Low Stock Items
                </Typography>
                <WarningIcon color="warning" />
              </Box>
              <Typography variant="h4">{mockData.metrics.lowStockItems}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Out of Stock
                </Typography>
                <WarningIcon color="error" />
              </Box>
              <Typography variant="h4">{mockData.metrics.outOfStockItems}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Total Stock Value
                </Typography>
                <AttachMoneyIcon color="success" />
              </Box>
              <Typography variant="h4">
                ₹{mockData.metrics.stockValue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Stock Level Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Stock Levels Trend</Typography>
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
                <LineChart
                  data={mockData.stockLevels}
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
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InventoryDashboard; 