import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { backendWebSocket } from '@/services/backendWebSocket';
import { BACKEND_CONFIG } from '@/config/backend';
import { useToast } from './use-toast';

export const useDeviceSubscription = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Connect to WebSocket
    backendWebSocket.connect();

    // Handle device connected
    const handleDeviceConnected = (device: any) => {
      console.log('Device connected:', device);
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      
      toast({
        title: 'New device detected',
        description: `${device.name} (${device.type}) has connected to your network`,
        variant: 'default',
      });
    };

    // Handle device disconnected
    const handleDeviceDisconnected = (device: any) => {
      console.log('Device disconnected:', device);
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      
      toast({
        title: 'Device disconnected',
        description: `${device.name} is now offline`,
        variant: 'destructive',
      });
    };

    // Handle device updated
    const handleDeviceUpdated = (device: any) => {
      console.log('Device updated:', device);
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    };

    // Subscribe to events
    backendWebSocket.on(BACKEND_CONFIG.WS_EVENTS.DEVICE_CONNECTED, handleDeviceConnected);
    backendWebSocket.on(BACKEND_CONFIG.WS_EVENTS.DEVICE_DISCONNECTED, handleDeviceDisconnected);
    backendWebSocket.on(BACKEND_CONFIG.WS_EVENTS.DEVICE_UPDATED, handleDeviceUpdated);

    return () => {
      backendWebSocket.off(BACKEND_CONFIG.WS_EVENTS.DEVICE_CONNECTED, handleDeviceConnected);
      backendWebSocket.off(BACKEND_CONFIG.WS_EVENTS.DEVICE_DISCONNECTED, handleDeviceDisconnected);
      backendWebSocket.off(BACKEND_CONFIG.WS_EVENTS.DEVICE_UPDATED, handleDeviceUpdated);
    };
  }, [queryClient, toast]);
};
