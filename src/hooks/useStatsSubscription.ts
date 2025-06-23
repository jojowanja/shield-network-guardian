
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
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
    // Subscribe to network stats changes
    const subscription = supabase
      .channel('network-stats-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'network_stats'
        },
        (payload) => {
          console.log('Network stats change:', payload);
          
          // Invalidate and refetch stats query
          queryClient.invalidateQueries({ queryKey: ['networkStats'] });

          const statsData = payload.new as any;
          
          // Update the usage stats based on new network data
          setStats(prevStats => ({
            ...prevStats,
            mondayUsage: Math.max(prevStats.mondayUsage, statsData.download_speed / 4),
            tuesdayUsage: Math.max(prevStats.tuesdayUsage, statsData.download_speed / 4)
          }));
          
          // Enhanced toast notifications with more detailed information
          if (statsData.stability < 80) {
            toast({
              title: 'Network Stability Alert',
              description: `Network stability has dropped to ${statsData.stability.toFixed(1)}%`,
              variant: 'destructive',
            });
          } else if (statsData.download_speed < 50) {
            toast({
              title: 'Network Speed Alert',
              description: `Download speed has dropped to ${statsData.download_speed.toFixed(1)} Mbps`,
              variant: 'destructive',
            });
          } else if (statsData.ping > 100) {
            toast({
              title: 'High Latency Alert',
              description: `Network latency has increased to ${statsData.ping.toFixed(0)}ms`,
              variant: 'destructive',
            });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, toast]);

  return { stats };
};
