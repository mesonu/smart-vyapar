export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const APP_CONFIG = {
  // API endpoints
  endpoints: {
    inventory: {
      optimization: `${API_URL}/api/inventory/optimization`,
      stock: `${API_URL}/api/inventory/stock`,
      products: `${API_URL}/api/inventory/products`,
      warehouses: `${API_URL}/api/inventory/warehouses`,
      alerts: `${API_URL}/api/inventory/alerts`,
    },
    billing: {
      analysis: `${API_URL}/api/billing/analysis`,
      invoices: `${API_URL}/api/billing/invoices`,
      customers: `${API_URL}/api/billing/customers`,
      predictions: `${API_URL}/api/billing/predictions`,
      gst: `${API_URL}/api/billing/gst-compliance`,
    },
    voice: {
      start: `${API_URL}/api/voice/start`,
      stop: `${API_URL}/api/voice/stop`,
      process: `${API_URL}/api/voice/process`,
      commands: `${API_URL}/api/voice/commands`,
      inventory: `${API_URL}/api/voice/inventory`,
      billing: `${API_URL}/api/voice/billing`,
      analytics: `${API_URL}/api/voice/analytics`,
    },
  },

  // Feature flags
  features: {
    voiceCommands: true,
    aiPredictions: true,
    realTimeUpdates: true,
    gstCompliance: true,
  },

  // UI settings
  ui: {
    theme: 'light',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
  },

  // Pagination settings
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  },

  // Cache settings
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutes
  },
}; 