
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from './use-toast';

export const useDeviceSubscription = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
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
          console.log('Device change:', payload);
          
          // Invalidate and refetch devices query
          queryClient.invalidateQueries({ queryKey: ['devices'] });

          // Show toast notification based on the change
          const operation = payload.eventType;
          const device = payload.new as any;

          if (operation === 'INSERT' && device) {
            toast({
              title: 'New device detected',
              description: `${device.name} (${device.type}) has connected to your network`,
              variant: 'default',
            });
          } else if (operation === 'UPDATE' && device) {
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
