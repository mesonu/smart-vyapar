import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Notifications: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Notifications
        </Typography>
        <Typography variant="body1">
          This is the notifications page.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Notifications; 