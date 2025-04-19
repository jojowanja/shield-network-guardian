
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { useToast } from './use-toast';
import { NetworkStats } from '@/services/networkService';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-public-anon-key';

const supabase = supabaseUrl !== 'https://your-supabase-project-url.supabase.co' 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const useStatsSubscription = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

          const stats = payload.new as NetworkStats;
          
          // Enhanced toast notifications with more detailed information
          if (stats.stability < 80) {
            toast({
              title: 'Network Stability Alert',
              description: `Network stability has dropped to ${stats.stability.toFixed(1)}%`,
              variant: 'destructive',
            });
          } else if (stats.downloadSpeed < 50) {
            toast({
              title: 'Network Speed Alert',
              description: `Download speed has dropped to ${stats.downloadSpeed.toFixed(1)} Mbps`,
              variant: 'destructive',
            });
          } else if (stats.ping > 100) {
            toast({
              title: 'High Latency Alert',
              description: `Network latency has increased to ${stats.ping.toFixed(0)}ms`,
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
};
