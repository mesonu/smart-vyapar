import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const PrivateRoute: React.FC = () => {
  const location = useLocation();
  const { user, loading, token } = useSelector((state: RootState) => state.auth);
  console.log("user===>", user, loading, token);
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute; 