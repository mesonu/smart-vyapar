import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Orders: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Order Management
        </Typography>
        <Typography variant="body1">
          This is the order management page.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Orders; 