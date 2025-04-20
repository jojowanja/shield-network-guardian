
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { useToast } from './use-toast';
import { NetworkStats } from '@/services/networkService';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-public-anon-key';

const supabase = supabaseUrl !== 'https://your-supabase-project-url.supabase.co' 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Mock usage data for the subscription optimizer
const mockUsageStats = {
  mondayUsage: 15,
  tuesdayUsage: 22,
  wednesdayUsage: 18,
  thursdayUsage: 25,
  fridayUsage: 20,
  saturdayUsage: 10,
  sundayUsage: 5
};

export const useStatsSubscription = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [stats, setStats] = useState(mockUsageStats);

  useEffect(() => {
    if (!supabase) return;

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
          // Invalidate and refetch stats query
          queryClient.invalidateQueries({ queryKey: ['networkStats'] });

          const statsData = payload.new as NetworkStats;
          
          // Update the usage stats based on new network data
          setStats(prevStats => ({
            ...prevStats,
            // Map new data to our usage structure (simplified)
            mondayUsage: Math.max(prevStats.mondayUsage, statsData.downloadSpeed / 4),
            tuesdayUsage: Math.max(prevStats.tuesdayUsage, statsData.downloadSpeed / 4)
          }));
          
          // Enhanced toast notifications with more detailed information
          if (statsData.stability < 80) {
            toast({
              title: 'Network Stability Alert',
              description: `Network stability has dropped to ${statsData.stability.toFixed(1)}%`,
              variant: 'destructive',
            });
          } else if (statsData.downloadSpeed < 50) {
            toast({
              title: 'Network Speed Alert',
              description: `Download speed has dropped to ${statsData.downloadSpeed.toFixed(1)} Mbps`,
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
