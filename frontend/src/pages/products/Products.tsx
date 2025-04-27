import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Products: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Products Management
        </Typography>
        <Typography variant="body1">
          This is the products management page.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Products; 