import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const PublicLayout: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Outlet />
    </Box>
  );
};

export default PublicLayout; 