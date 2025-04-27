import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome, {user?.name}! This is the admin dashboard.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;
