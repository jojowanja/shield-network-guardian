
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { useToast } from './use-toast';
import { Device } from '@/services/networkService';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-public-anon-key';

const supabase = supabaseUrl !== 'https://your-supabase-project-url.supabase.co' 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const useDeviceSubscription = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!supabase) return;

    // Subscribe to device changes
    const subscription = supabase
      .channel('devices-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices'
        },
        (payload) => {
          // Invalidate and refetch devices query
          queryClient.invalidateQueries({ queryKey: ['devices'] });

          // Show toast notification based on the change
          const operation = payload.eventType;
          const device = payload.new as Device;

          if (operation === 'INSERT') {
            toast({
              title: 'New device detected',
              description: `${device.name} (${device.type}) has connected to your network`,
              variant: 'default',
            });
          } else if (operation === 'UPDATE') {
            if (device.status === 'offline') {
              toast({
                title: 'Device disconnected',
                description: `${device.name} is now offline`,
                variant: 'destructive',
              });
            } else if (payload.old && payload.old.status === 'offline' && device.status === 'online') {
              toast({
                title: 'Device reconnected',
                description: `${device.name} is back online`,
                variant: 'default',
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, toast]);
};
