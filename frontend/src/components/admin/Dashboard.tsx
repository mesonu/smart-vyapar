import React from 'react';
import { Grid, Typography } from '@mui/material';
import Card from '../ui/Card';
import Button from '../ui/Button';

const AdminDashboard: React.FC = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card title="Quick Actions">
          <Button variant="contained" color="primary">
            Add User
          </Button>
          <Button variant="contained" color="secondary">
            Manage Roles
          </Button>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card title="System Status">
          <Typography>All systems operational</Typography>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AdminDashboard; 