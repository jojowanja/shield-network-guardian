
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

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

  // Simulate network speed test
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
      
      setStats(prev => {
        const newStats = {
          ...prev,
          downloadSpeed: speedTest.download,
          uploadSpeed: speedTest.upload,
          ping: speedTest.ping,
          stability: Math.max(80, Math.min(99, prev.stability + (Math.random() - 0.5) * 5)),
          lastUpdate: new Date()
        };

        // Simulate device connections/disconnections (10% chance)
        if (Math.random() > 0.9) {
          const deviceChange = Math.random() > 0.5 ? 1 : -1;
          const newDevices = Math.max(1, Math.min(12, prev.devices + deviceChange));
          
          if (newDevices !== prev.devices) {
            const action = newDevices > prev.devices ? "connected to" : "disconnected from";
            toast({
              title: `Device ${action} network`,
              description: `${newDevices} devices now connected`,
              variant: newDevices > prev.devices ? "default" : "destructive",
            });
            newStats.devices = newDevices;
          }
        }

        // Simulate optimization changes (5% chance)
        if (Math.random() > 0.95) {
          const optimizationChange = Math.random() > 0.6 ? 1 : -1;
          const newOptimizations = Math.max(0, Math.min(5, prev.activeOptimizations + optimizationChange));
          
          if (newOptimizations !== prev.activeOptimizations) {
            const action = newOptimizations > prev.activeOptimizations ? "enabled" : "disabled";
            toast({
              title: `Network optimization ${action}`,
              description: newOptimizations > prev.activeOptimizations 
                ? "Network performance should improve"
                : "This may affect network performance",
              variant: newOptimizations > prev.activeOptimizations ? "default" : "destructive",
            });
            newStats.activeOptimizations = newOptimizations;
          }
        }

        return newStats;
      });
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

  // Set up periodic updates
  useEffect(() => {
    const intervalId = setInterval(updateStats, 5000); // Update every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  return { stats, updateStats };
};
