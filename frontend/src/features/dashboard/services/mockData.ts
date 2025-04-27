// TODO: Replace with actual API calls when backend is ready
export const mockDashboardData = {
  stats: {
    totalSales: {
      value: '₹45,231',
      trend: '+12% from last month',
      color: '#4CAF50'
    },
    inventoryItems: {
      value: '1,234',
      trend: '+5% from last month',
      color: '#2196F3'
    },
    activeCustomers: {
      value: '1,234',
      trend: '+8% from last month',
      color: '#FF9800'
    },
    pendingOrders: {
      value: '12',
      color: '#F44336'
    }
  },
  salesChart: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [30000, 35000, 40000, 38000, 42000, 45000]
  },
  topProducts: [
    { id: 1, name: 'Product A', sales: 15000, target: 20000 },
    { id: 2, name: 'Product B', sales: 12000, target: 15000 },
    { id: 3, name: 'Product C', sales: 8000, target: 10000 },
    { id: 4, name: 'Product D', sales: 6000, target: 8000 }
  ],
  recentActivities: [
    { id: 1, user: 'John Doe', action: 'added new product', time: '2 hours ago', icon: 'inventory' },
    { id: 2, user: 'Jane Smith', action: 'created invoice', time: '3 hours ago', icon: 'receipt' },
    { id: 3, user: 'Mike Johnson', action: 'updated inventory', time: '5 hours ago', icon: 'inventory' },
    // { id: 4, user: 'Sarah Wilson', action: 'processed order', time: '1 day ago', icon: 'shopping_cart' }
  ],
  lowStockItems: [
    { id: 1, name: 'Product A', stock: 5, threshold: 10 },
    { id: 2, name: 'Product B', stock: 3, threshold: 15 },
    { id: 3, name: 'Product C', stock: 2, threshold: 20 }
  ],
  quickAccessItems: {
    inventory: [
      { text: 'View Inventory', icon: 'inventory', path: '/dashboard/inventory' },
      { text: 'Add New Product', icon: 'shopping_cart', path: '/dashboard/products/new' },
      { text: 'Low Stock Items', icon: 'notifications', path: '/dashboard/inventory/low-stock' }
    ],
    sales: [
      { text: 'Create Invoice', icon: 'receipt', path: '/dashboard/billing/new' },
      { text: 'View Sales Report', icon: 'trending_up', path: '/dashboard/billing/reports' },
      { text: 'GST Returns', icon: 'account_balance', path: '/dashboard/gst/returns' }
    ]
  }
};

// TODO: Replace with actual API service
export const dashboardService = {
  getDashboardData: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockDashboardData;
  }
}; 