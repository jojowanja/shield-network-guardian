import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-public-anon-key';

// Create client only if we have valid URL and key
const supabaseClient = () => {
  if (!supabaseUrl || supabaseUrl === 'https://your-supabase-project-url.supabase.co') {
    console.warn('Supabase URL is not configured. Using mock data instead.');
    return null;
  }
  return createClient(supabaseUrl, supabaseKey);
};

const supabase = supabaseClient();

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

// Modified to handle the case when supabase client is not available
export const fetchDevices = async () => {
  if (!supabase) {
    // Return mock data when no Supabase connection
    return mockDevices;
  }

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

// Mock data to use when Supabase is not configured
const mockDevices = [
  {
    id: "1",
    name: "MacBook Pro",
    type: "laptop",
    ip: "192.168.1.101",
    mac: "A1:B2:C3:D4:E5:F6",
    status: "online",
    lastSeen: new Date().toISOString(),
    bandwidth: 12.5,
    userId: "mock-user-id"
  },
  {
    id: "2",
    name: "iPhone 13",
    type: "smartphone",
    ip: "192.168.1.102",
    mac: "G7:H8:I9:J0:K1:L2",
    status: "online",
    lastSeen: new Date().toISOString(),
    bandwidth: 5.2,
    userId: "mock-user-id"
  },
  {
    id: "3",
    name: "Smart TV",
    type: "tv",
    ip: "192.168.1.103",
    mac: "M3:N4:O5:P6:Q7:R8",
    status: "offline",
    lastSeen: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    bandwidth: 0,
    userId: "mock-user-id"
  }
];

// Update the rest of the functions to handle the case when supabase is null
export const addDevice = async (device: Omit<Device, "id" | "userId">) => {
  if (!supabase) {
    // Return mock response
    return { ...device, id: `mock-${Date.now()}`, userId: "mock-user-id" };
  }

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
  if (!supabase) {
    // Return mock response
    return { ...updates, id, userId: "mock-user-id" };
  }

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
  if (!supabase) {
    return true; // Mock success
  }

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

// Mock network stats
const mockNetworkStats = Array(10).fill(null).map((_, i) => ({
  id: `mock-${i}`,
  downloadSpeed: 80 + Math.random() * 20,
  uploadSpeed: 20 + Math.random() * 10,
  ping: 15 + Math.random() * 10,
  stability: 90 + Math.random() * 10,
  devices: 3 + Math.floor(Math.random() * 5),
  activeOptimizations: Math.floor(Math.random() * 4),
  timestamp: new Date(Date.now() - i * 3600000).toISOString(),
  userId: "mock-user-id"
}));

export const fetchNetworkStats = async (limit = 10) => {
  if (!supabase) {
    return mockNetworkStats.slice(0, limit);
  }

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
  if (!supabase) {
    return { ...stat, id: `mock-${Date.now()}`, userId: "mock-user-id" };
  }

  const { data: session } = await supabase.auth.getSession();
  if (!session.session) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("network_stats")
    .insert([{ ...stat, userId: session.session.user.id }])
    .select();

  if (error) throw error;
  return data[0];
};

// Mock security events
const mockSecurityEvents = [
  {
    id: "1",
    deviceId: "2",
    eventType: "new_device",
    severity: "low",
    description: "New device connected to your network",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    resolved: false,
    userId: "mock-user-id"
  },
  {
    id: "2",
    deviceId: null,
    eventType: "suspicious_activity",
    severity: "high",
    description: "Unusual outbound traffic detected",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    resolved: false,
    userId: "mock-user-id"
  },
  {
    id: "3",
    deviceId: "1",
    eventType: "network_change",
    severity: "medium",
    description: "Network configuration changed",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    resolved: true,
    userId: "mock-user-id"
  }
];

export const fetchSecurityEvents = async (resolved = false, limit = 10) => {
  if (!supabase) {
    return mockSecurityEvents
      .filter(event => event.resolved === resolved)
      .slice(0, limit);
  }

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
  if (!supabase) {
    return { ...event, id: `mock-${Date.now()}`, userId: "mock-user-id" };
  }

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
  if (!supabase) {
    const event = mockSecurityEvents.find(e => e.id === id);
    if (event) {
      event.resolved = true;
      return event;
    }
    return null;
  }

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
