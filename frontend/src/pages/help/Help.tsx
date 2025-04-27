import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Help: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Help & Support
        </Typography>
        <Typography variant="body1">
          This is the help and support page.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Help; 