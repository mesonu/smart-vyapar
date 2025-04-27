import React from 'react';
import {
  Grid,
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  Chip,
  Avatar,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { useDashboardData } from '../../features/dashboard/hooks/useDashboardData';
import {
  StatCard,
  QuickAccessCard,
  RecentActivityCard,
  LowStockCard,
  SalesChartCard,
  TopProductsCard
} from '../../features/dashboard/components';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useDashboardData();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your business today."
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }]}
      />

      {/* Section 1: Stats */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Total Sales"
              value={data.stats.totalSales.value}
              icon={<TrendingUpIcon />}
              color={data.stats.totalSales.color}
              trend={data.stats.totalSales.trend}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Inventory Items"
              value={data.stats.inventoryItems.value}
              icon={<InventoryIcon />}
              color={data.stats.inventoryItems.color}
              trend={data.stats.inventoryItems.trend}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Active Customers"
              value={data.stats.activeCustomers.value}
              icon={<PeopleIcon />}
              color={data.stats.activeCustomers.color}
              trend={data.stats.activeCustomers.trend}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Pending Orders"
              value={data.stats.pendingOrders.value}
              icon={<ShoppingCartIcon />}
              color={data.stats.pendingOrders.color}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Section 2: Business Insights */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>Business Insights</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <SalesChartCard data={data.salesChart} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TopProductsCard products={data.topProducts} />
          </Grid>
        </Grid>
      </Box>

      {/* Section 3: Quick Access */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>Quick Access</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <QuickAccessCard title="Inventory Management" items={data.quickAccessItems.inventory} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <QuickAccessCard title="Sales & Billing" items={data.quickAccessItems.sales} />
          </Grid>
        </Grid>
      </Box>

      {/* Section 4: Activity & Alerts */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>Activity & Alerts</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <RecentActivityCard activities={data.recentActivities} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <LowStockCard items={data.lowStockItems} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
