// Backend configuration
export const BACKEND_CONFIG = {
  // Update this with your backend URL
  API_URL: 'http://localhost:5000/api',
  WS_URL: 'ws://localhost:5000/ws',
  
  // API endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    RESET_PASSWORD: '/auth/reset-password',
    
    // Devices
    DEVICES: '/devices',
    DEVICE_BY_ID: (id: string) => `/devices/${id}`,
    
    // Network Stats
    NETWORK_STATS: '/network-stats',
    
    // Security Events
    SECURITY_EVENTS: '/security-events',
    SECURITY_EVENT_BY_ID: (id: string) => `/security-events/${id}`,
    
    // User Profile
    PROFILE: '/profile',
    SETTINGS: '/settings',
  },
  
  // WebSocket events
  WS_EVENTS: {
    DEVICE_CONNECTED: 'device:connected',
    DEVICE_DISCONNECTED: 'device:disconnected',
    DEVICE_UPDATED: 'device:updated',
    STATS_UPDATED: 'stats:updated',
    SECURITY_EVENT: 'security:event',
  }
};
