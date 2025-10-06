import { BACKEND_CONFIG } from '@/config/backend';
import { backendAuthService } from './backendAuthService';

export interface Device {
  id: string;
  name: string;
  type: "laptop" | "smartphone" | "tv" | "other";
  ip: string;
  mac: string;
  status: "online" | "offline";
  lastSeen: string;
  bandwidth: number;
  userId: string;
  owner?: string;
  isGuest?: boolean;
}

export interface NetworkStats {
  id: string;
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  stability: number;
  devices: number;
  activeOptimizations: number;
  timestamp: string;
  userId: string;
}

export interface SecurityEvent {
  id: string;
  deviceId: string | null;
  eventType: "new_device" | "suspicious_activity" | "network_change" | "other";
  severity: "low" | "medium" | "high";
  description: string;
  timestamp: string;
  resolved: boolean;
  userId: string;
}

class BackendNetworkService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data?: T; error?: string }> {
    try {
      const token = backendAuthService.getToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${BACKEND_CONFIG.API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Request failed' };
      }

      return { data };
    } catch (error) {
      console.error('Request error:', error);
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  // Device Management
  async fetchDevices(): Promise<Device[]> {
    console.log('Fetching devices...');
    const { data, error } = await this.request<Device[]>(
      BACKEND_CONFIG.ENDPOINTS.DEVICES
    );

    if (error) {
      console.error('Error fetching devices:', error);
      return [];
    }

    return data || [];
  }

  async addDevice(device: Omit<Device, "id" | "userId">) {
    console.log('Adding device:', device.name);
    const { data, error } = await this.request(
      BACKEND_CONFIG.ENDPOINTS.DEVICES,
      {
        method: 'POST',
        body: JSON.stringify(device),
      }
    );

    if (error) {
      console.error('Error adding device:', error);
      throw new Error(error);
    }

    return data;
  }

  async updateDevice(id: string, updates: Partial<Device>) {
    console.log('Updating device:', id);
    const { data, error } = await this.request(
      BACKEND_CONFIG.ENDPOINTS.DEVICE_BY_ID(id),
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );

    if (error) {
      console.error('Error updating device:', error);
      throw new Error(error);
    }

    return data;
  }

  async removeDevice(id: string): Promise<boolean> {
    console.log('Removing device:', id);
    const { error } = await this.request(
      BACKEND_CONFIG.ENDPOINTS.DEVICE_BY_ID(id),
      {
        method: 'DELETE',
      }
    );

    if (error) {
      console.error('Error removing device:', error);
      return false;
    }

    return true;
  }

  // Network Statistics
  async fetchNetworkStats(limit: number = 10): Promise<NetworkStats[]> {
    console.log('Fetching network stats...');
    const { data, error } = await this.request<NetworkStats[]>(
      `${BACKEND_CONFIG.ENDPOINTS.NETWORK_STATS}?limit=${limit}`
    );

    if (error) {
      console.error('Error fetching network stats:', error);
      return [];
    }

    return data || [];
  }

  async addNetworkStat(stat: Omit<NetworkStats, "id" | "userId">) {
    console.log('Adding network stat...');
    const { data, error } = await this.request(
      BACKEND_CONFIG.ENDPOINTS.NETWORK_STATS,
      {
        method: 'POST',
        body: JSON.stringify(stat),
      }
    );

    if (error) {
      console.error('Error adding network stat:', error);
      throw new Error(error);
    }

    return data;
  }

  // Security Events
  async fetchSecurityEvents(resolved?: boolean, limit: number = 50): Promise<SecurityEvent[]> {
    console.log('Fetching security events...');
    const params = new URLSearchParams();
    if (resolved !== undefined) params.append('resolved', String(resolved));
    params.append('limit', String(limit));

    const { data, error } = await this.request<SecurityEvent[]>(
      `${BACKEND_CONFIG.ENDPOINTS.SECURITY_EVENTS}?${params.toString()}`
    );

    if (error) {
      console.error('Error fetching security events:', error);
      return [];
    }

    return data || [];
  }

  async addSecurityEvent(event: Omit<SecurityEvent, "id" | "userId">) {
    console.log('Adding security event...');
    const { data, error } = await this.request(
      BACKEND_CONFIG.ENDPOINTS.SECURITY_EVENTS,
      {
        method: 'POST',
        body: JSON.stringify(event),
      }
    );

    if (error) {
      console.error('Error adding security event:', error);
      throw new Error(error);
    }

    return data;
  }

  async resolveSecurityEvent(id: string) {
    console.log('Resolving security event:', id);
    const { data, error } = await this.request(
      BACKEND_CONFIG.ENDPOINTS.SECURITY_EVENT_BY_ID(id),
      {
        method: 'PUT',
        body: JSON.stringify({ resolved: true }),
      }
    );

    if (error) {
      console.error('Error resolving security event:', error);
      throw new Error(error);
    }

    return data;
  }
  // User Profile & Settings
  async getProfile() {
    console.log('Fetching profile...');
    const { data, error } = await this.request(
      BACKEND_CONFIG.ENDPOINTS.PROFILE
    );

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }

  async updateProfile(updates: any) {
    console.log('Updating profile...');
    const { data, error } = await this.request(
      BACKEND_CONFIG.ENDPOINTS.PROFILE,
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );

    if (error) {
      console.error('Error updating profile:', error);
      throw new Error(error);
    }

    return data;
  }

  async getSettings() {
    console.log('Fetching settings...');
    const { data, error } = await this.request(
      BACKEND_CONFIG.ENDPOINTS.SETTINGS
    );

    if (error) {
      console.error('Error fetching settings:', error);
      return null;
    }

    return data;
  }

  async updateSettings(updates: any) {
    console.log('Updating settings...');
    const { data, error } = await this.request(
      BACKEND_CONFIG.ENDPOINTS.SETTINGS,
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );

    if (error) {
      console.error('Error updating settings:', error);
      throw new Error(error);
    }

    return data;
  }
}

export const backendNetworkService = new BackendNetworkService();
