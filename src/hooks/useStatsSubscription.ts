import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { backendWebSocket } from '@/services/backendWebSocket';
import { BACKEND_CONFIG } from '@/config/backend';
import { useToast } from './use-toast';

export const useStatsSubscription = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [stats, setStats] = useState({
    mondayUsage: 15,
    tuesdayUsage: 22,
    wednesdayUsage: 18,
    thursdayUsage: 25,
    fridayUsage: 20,
    saturdayUsage: 10,
    sundayUsage: 5
  });

  useEffect(() => {
    // Connect to WebSocket
    backendWebSocket.connect();

    const handleStatsUpdate = (statsData: any) => {
      console.log('Network stats update:', statsData);
      
      // Invalidate and refetch stats query
      queryClient.invalidateQueries({ queryKey: ['networkStats'] });

      // Update the usage stats based on new network data
      setStats(prevStats => ({
        ...prevStats,
        mondayUsage: Math.max(prevStats.mondayUsage, statsData.downloadSpeed / 4 || statsData.download_speed / 4),
        tuesdayUsage: Math.max(prevStats.tuesdayUsage, statsData.downloadSpeed / 4 || statsData.download_speed / 4)
      }));
      
      // Enhanced toast notifications with more detailed information
      if (statsData.stability < 80) {
        toast({
          title: 'Network Stability Alert',
          description: `Network stability has dropped to ${statsData.stability.toFixed(1)}%`,
          variant: 'destructive',
        });
      } else if (statsData.downloadSpeed < 50 || statsData.download_speed < 50) {
        const speed = statsData.downloadSpeed || statsData.download_speed;
        toast({
          title: 'Network Speed Alert',
          description: `Download speed has dropped to ${speed.toFixed(1)} Mbps`,
          variant: 'destructive',
        });
      } else if (statsData.ping > 100) {
        toast({
          title: 'High Latency Alert',
          description: `Network latency has increased to ${statsData.ping.toFixed(0)}ms`,
          variant: 'destructive',
        });
      }
    };

    backendWebSocket.on(BACKEND_CONFIG.WS_EVENTS.STATS_UPDATED, handleStatsUpdate);

    return () => {
      backendWebSocket.off(BACKEND_CONFIG.WS_EVENTS.STATS_UPDATED, handleStatsUpdate);
    };
  }, [queryClient, toast]);

  return { stats };
};
