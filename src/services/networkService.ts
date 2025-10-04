import { backendNetworkService, Device, NetworkStats, SecurityEvent } from './backendNetworkService';

export type { Device, NetworkStats, SecurityEvent };

export const fetchDevices = async (): Promise<Device[]> => {
  return await backendNetworkService.fetchDevices();
};

export const addDevice = async (device: Omit<Device, "id" | "userId">) => {
  return await backendNetworkService.addDevice(device);
};

export const updateDevice = async (id: string, updates: Partial<Device>) => {
  return await backendNetworkService.updateDevice(id, updates);
};

export const removeDevice = async (id: string): Promise<boolean> => {
  return await backendNetworkService.removeDevice(id);
};

export const fetchNetworkStats = async (limit: number = 10): Promise<NetworkStats[]> => {
  return await backendNetworkService.fetchNetworkStats(limit);
};

export const addNetworkStat = async (stat: Omit<NetworkStats, "id" | "userId">) => {
  return await backendNetworkService.addNetworkStat(stat);
};

export const fetchSecurityEvents = async (resolved?: boolean, limit: number = 50): Promise<SecurityEvent[]> => {
  return await backendNetworkService.fetchSecurityEvents(resolved, limit);
};

export const addSecurityEvent = async (event: Omit<SecurityEvent, "id" | "userId">) => {
  return await backendNetworkService.addSecurityEvent(event);
};

export const resolveSecurityEvent = async (id: string) => {
  return await backendNetworkService.resolveSecurityEvent(id);
};
