import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Receipt as ReceiptIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

// Mock data for demonstration
const mockData = {
  metrics: {
    totalGST: 250000,
    pendingReturns: 2,
    compliant: true,
    lastFilingDate: '2024-03-31',
  },
  transactions: [
    {
      id: 1,
      date: '2024-04-01',
      invoiceNo: 'INV-001',
      amount: 50000,
      gstAmount: 9000,
      status: 'Paid',
    },
    {
      id: 2,
      date: '2024-04-02',
      invoiceNo: 'INV-002',
      amount: 75000,
      gstAmount: 13500,
      status: 'Pending',
    },
    {
      id: 3,
      date: '2024-04-03',
      invoiceNo: 'INV-003',
      amount: 30000,
      gstAmount: 5400,
      status: 'Paid',
    },
  ],
};

const GSTCompliance: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">GST Compliance</Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => {/* Handle download */}}
        >
          Export Report
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Key Metrics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Total GST
                </Typography>
                <ReceiptIcon color="primary" />
              </Box>
              <Typography variant="h4">
                ₹{mockData.metrics.totalGST.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Pending Returns
                </Typography>
                <WarningIcon color="warning" />
              </Box>
              <Typography variant="h4">{mockData.metrics.pendingReturns}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Compliance Status
                </Typography>
                {mockData.metrics.compliant ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <WarningIcon color="error" />
                )}
              </Box>
              <Typography variant="h4">
                {mockData.metrics.compliant ? 'Compliant' : 'Non-Compliant'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Last Filing Date
                </Typography>
                <ReceiptIcon color="info" />
              </Box>
              <Typography variant="h4">{mockData.metrics.lastFilingDate}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* GST Transactions Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent GST Transactions</Typography>
              <IconButton onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>View All</MenuItem>
                <MenuItem onClick={handleMenuClose}>Export Data</MenuItem>
              </Menu>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Invoice No.</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">GST Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockData.transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.invoiceNo}</TableCell>
                      <TableCell align="right">
                        ₹{transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        ₹{transaction.gstAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {transaction.status === 'Paid' ? (
                          <CheckCircleIcon color="success" fontSize="small" />
                        ) : (
                          <WarningIcon color="warning" fontSize="small" />
                        )}
                        {transaction.status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GSTCompliance; 