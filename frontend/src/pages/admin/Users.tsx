import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Users: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Users Management
        </Typography>
        <Typography variant="body1">
          This is the users management page.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Users; 