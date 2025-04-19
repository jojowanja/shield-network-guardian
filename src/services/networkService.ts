
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

// Devices CRUD operations
export const fetchDevices = async () => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .eq("userId", session.session.user.id)
    .order("lastSeen", { ascending: false });

  if (error) throw error;
  return data;
};

export const addDevice = async (device: Omit<Device, "id" | "userId">) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("devices")
    .insert([{ ...device, userId: session.session.user.id }])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateDevice = async (id: string, updates: Partial<Device>) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("devices")
    .update(updates)
    .eq("id", id)
    .eq("userId", session.session.user.id)
    .select();

  if (error) throw error;
  return data[0];
};

export const removeDevice = async (id: string) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("devices")
    .delete()
    .eq("id", id)
    .eq("userId", session.session.user.id);

  if (error) throw error;
  return true;
};

// Network stats operations
export const fetchNetworkStats = async (limit = 10) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("network_stats")
    .select("*")
    .eq("userId", session.session.user.id)
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const addNetworkStat = async (stat: Omit<NetworkStats, "id" | "userId">) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("network_stats")
    .insert([{ ...stat, userId: session.session.user.id }])
    .select();

  if (error) throw error;
  return data[0];
};

// Security events operations
export const fetchSecurityEvents = async (resolved = false, limit = 10) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("security_events")
    .select("*")
    .eq("userId", session.session.user.id)
    .eq("resolved", resolved)
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const addSecurityEvent = async (event: Omit<SecurityEvent, "id" | "userId">) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("security_events")
    .insert([{ ...event, userId: session.session.user.id }])
    .select();

  if (error) throw error;
  return data[0];
};

export const resolveSecurityEvent = async (id: string) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("security_events")
    .update({ resolved: true })
    .eq("id", id)
    .eq("userId", session.session.user.id)
    .select();

  if (error) throw error;
  return data[0];
};
