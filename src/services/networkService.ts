
import { supabase } from "@/integrations/supabase/client";

export interface Device {
  id: string;
  name: string;
  type: "laptop" | "smartphone" | "tv" | "other";
  ip: string;
  mac: string;
  status: "online" | "offline";
  lastSeen: string;
  bandwidth: number; // in Mbps
  userId: string;
  owner?: string;     // Added for device ownership
  isGuest?: boolean;  // Added to mark guest devices
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

// Fetch devices for authenticated user
export const fetchDevices = async () => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .eq("user_id", session.session.user.id)
    .order("last_seen", { ascending: false });

  if (error) throw error;
  
  // Transform data to match interface
  return data.map(device => ({
    id: device.id,
    name: device.name,
    type: device.type,
    ip: device.ip,
    mac: device.mac,
    status: device.status,
    lastSeen: device.last_seen || new Date().toISOString(),
    bandwidth: Number(device.bandwidth) || 0,
    userId: device.user_id,
    owner: device.owner,
    isGuest: device.is_guest
  }));
};

export const addDevice = async (device: Omit<Device, "id" | "userId">) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("devices")
    .insert([{ 
      name: device.name,
      type: device.type,
      ip: device.ip,
      mac: device.mac,
      status: device.status,
      last_seen: device.lastSeen,
      bandwidth: device.bandwidth,
      owner: device.owner,
      is_guest: device.isGuest,
      user_id: session.session.user.id 
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateDevice = async (id: string, updates: Partial<Device>) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("User not authenticated");

  const dbUpdates: any = {};
  if (updates.name) dbUpdates.name = updates.name;
  if (updates.status) dbUpdates.status = updates.status;
  if (updates.lastSeen) dbUpdates.last_seen = updates.lastSeen;
  if (updates.bandwidth !== undefined) dbUpdates.bandwidth = updates.bandwidth;
  if (updates.owner) dbUpdates.owner = updates.owner;
  if (updates.isGuest !== undefined) dbUpdates.is_guest = updates.isGuest;

  const { data, error } = await supabase
    .from("devices")
    .update(dbUpdates)
    .eq("id", id)
    .eq("user_id", session.session.user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const removeDevice = async (id: string) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("devices")
    .delete()
    .eq("id", id)
    .eq("user_id", session.session.user.id);

  if (error) throw error;
  return true;
};

export const fetchNetworkStats = async (limit = 10) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("network_stats")
    .select("*")
    .eq("user_id", session.session.user.id)
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) throw error;
  
  return data.map(stat => ({
    id: stat.id,
    downloadSpeed: Number(stat.download_speed),
    uploadSpeed: Number(stat.upload_speed),
    ping: Number(stat.ping),
    stability: Number(stat.stability),
    devices: stat.devices,
    activeOptimizations: stat.active_optimizations || 0,
    timestamp: stat.timestamp || new Date().toISOString(),
    userId: stat.user_id
  }));
};

export const addNetworkStat = async (stat: Omit<NetworkStats, "id" | "userId">) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("network_stats")
    .insert([{ 
      download_speed: stat.downloadSpeed,
      upload_speed: stat.uploadSpeed,
      ping: stat.ping,
      stability: stat.stability,
      devices: stat.devices,
      active_optimizations: stat.activeOptimizations,
      timestamp: stat.timestamp,
      user_id: session.session.user.id 
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const fetchSecurityEvents = async (resolved = false, limit = 10) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("security_events")
    .select("*")
    .eq("user_id", session.session.user.id)
    .eq("resolved", resolved)
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) throw error;
  
  return data.map(event => ({
    id: event.id,
    deviceId: event.device_id,
    eventType: event.event_type,
    severity: event.severity,
    description: event.description,
    timestamp: event.timestamp || new Date().toISOString(),
    resolved: event.resolved || false,
    userId: event.user_id
  }));
};

export const addSecurityEvent = async (event: Omit<SecurityEvent, "id" | "userId">) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("security_events")
    .insert([{ 
      device_id: event.deviceId,
      event_type: event.eventType,
      severity: event.severity,
      description: event.description,
      resolved: event.resolved,
      timestamp: event.timestamp,
      user_id: session.session.user.id 
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const resolveSecurityEvent = async (id: string) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("security_events")
    .update({ resolved: true })
    .eq("id", id)
    .eq("user_id", session.session.user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
