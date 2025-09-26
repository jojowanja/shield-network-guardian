
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { fetchNetworkStats, addNetworkStat } from "@/services/networkService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface NetworkStats {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  stability: number;
  devices: number;
  activeOptimizations: number;
  lastUpdate: Date;
}

export const useNetworkStats = () => {
  const [stats, setStats] = useState<NetworkStats>({
    downloadSpeed: 85,
    uploadSpeed: 22,
    ping: 18,
    stability: 95,
    devices: 8,
    activeOptimizations: 3,
    lastUpdate: new Date()
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch historical network stats
  const { data: networkHistory } = useQuery({
    queryKey: ["networkStats", user?.id],
    queryFn: () => fetchNetworkStats(10),
    enabled: !!user,
  });

  // Mutation for adding new network stats
  const addStatsMutation = useMutation({
    mutationFn: (stats: Omit<NetworkStats, "lastUpdate">) => 
      addNetworkStat({
        downloadSpeed: stats.downloadSpeed,
        uploadSpeed: stats.uploadSpeed,
        ping: stats.ping,
        stability: stats.stability,
        devices: stats.devices,
        activeOptimizations: stats.activeOptimizations,
        timestamp: new Date().toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["networkStats"] });
    },
  });

  // Simulate network speed test but with real data persistence
  const runSpeedTest = async () => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate realistic network fluctuations
    const newDownload = Math.max(20, Math.min(150, stats.downloadSpeed + (Math.random() - 0.5) * 30));
    const newUpload = Math.max(5, Math.min(45, stats.uploadSpeed + (Math.random() - 0.5) * 10));
    const newPing = Math.max(8, Math.min(50, stats.ping + (Math.random() - 0.5) * 8));
    
    return { download: newDownload, upload: newUpload, ping: newPing };
  };

  const updateStats = async () => {
    try {
      const speedTest = await runSpeedTest();
      
      const newStats = {
        downloadSpeed: speedTest.download,
        uploadSpeed: speedTest.upload,
        ping: speedTest.ping,
        stability: Math.max(80, Math.min(99, stats.stability + (Math.random() - 0.5) * 5)),
        devices: stats.devices,
        activeOptimizations: stats.activeOptimizations,
        lastUpdate: new Date()
      };

      setStats(newStats);

      // Persist to database occasionally (every 3rd update)
      if (user && Math.random() > 0.7) {
        addStatsMutation.mutate({
          downloadSpeed: newStats.downloadSpeed,
          uploadSpeed: newStats.uploadSpeed,
          ping: newStats.ping,
          stability: newStats.stability,
          devices: newStats.devices,
          activeOptimizations: newStats.activeOptimizations,
        });
      }
      
      // Simulate device connections/disconnections (10% chance)
      if (Math.random() > 0.9) {
        const deviceChange = Math.random() > 0.5 ? 1 : -1;
        const newDevices = Math.max(1, Math.min(12, stats.devices + deviceChange));
        
        if (newDevices !== stats.devices) {
          const action = newDevices > stats.devices ? "connected to" : "disconnected from";
          toast({
            title: `Device ${action} network`,
            description: `${newDevices} devices now connected`,
            variant: newDevices > stats.devices ? "default" : "destructive",
          });
          setStats(prev => ({ ...prev, devices: newDevices }));
        }
      }

      // Simulate optimization changes (5% chance)
      if (Math.random() > 0.95) {
        const optimizationChange = Math.random() > 0.6 ? 1 : -1;
        const newOptimizations = Math.max(0, Math.min(5, stats.activeOptimizations + optimizationChange));
        
        if (newOptimizations !== stats.activeOptimizations) {
          const action = newOptimizations > stats.activeOptimizations ? "enabled" : "disabled";
          toast({
            title: `Network optimization ${action}`,
            description: newOptimizations > stats.activeOptimizations 
              ? "Network performance should improve"
              : "This may affect network performance",
            variant: newOptimizations > stats.activeOptimizations ? "default" : "destructive",
          });
          setStats(prev => ({ ...prev, activeOptimizations: newOptimizations }));
        }
      }
    } catch (error) {
      toast({
        title: "Error updating network stats",
        description: "Failed to fetch latest network performance data",
        variant: "destructive",
      });
    }
  };

  // Run initial update
  useEffect(() => {
    updateStats();
  }, []);

  // Set up periodic updates with longer interval to reduce load
  useEffect(() => {
    const intervalId = setInterval(updateStats, 15000); // Update every 15 seconds
    return () => clearInterval(intervalId);
  }, [user]); // Add user dependency to restart interval on auth changes

  return { 
    stats, 
    updateStats,
    networkHistory
  };
};
