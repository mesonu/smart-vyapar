import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
// import { refreshToken } from '../store/slices/authSlice';

const PrivateRoute: React.FC = () => {
  const location = useLocation();
  // const dispatch = useDispatch<AppDispatch>();
  const { user, loading, token } = useSelector((state: RootState) => state.auth);
  
  // TODO: Implement token refresh functionality
  // useEffect(() => {
  //   // If we have a token but no user, try to refresh the token
  //   if (token && !user && !loading) {
  //     dispatch(refreshToken());
  //   }
  // }, [token, user, loading, dispatch]);

  // Show loading state until we've checked authentication
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

  // If no user or token, redirect to login
  if (!user || !token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check for admin role
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute; 