
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

interface RaspberryPiStatus {
  connected: boolean;
  ipAddress: string | null;
  latency: number | null;
}

export const useRaspberryPi = () => {
  const [status, setStatus] = useState<RaspberryPiStatus>({
    connected: false,
    ipAddress: null,
    latency: null
  });
  const wsRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectToDevice = async (ipAddress: string) => {
    try {
      // First check if the Raspberry Pi is reachable
      const response = await fetch(`http://${ipAddress}:3000/health`);
      
      if (!response.ok) {
        throw new Error('Device not reachable');
      }

      // Initialize WebSocket connection
      const ws = new WebSocket(`ws://${ipAddress}:3000/network-stats`);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus({
          connected: true,
          ipAddress,
          latency: 0
        });
        
        toast({
          title: "Connected to Raspberry Pi",
          description: `Successfully connected to device at ${ipAddress}`,
        });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setStatus(prev => ({
            ...prev,
            latency: data.latency || prev.latency
          }));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Error communicating with Raspberry Pi",
          variant: "destructive"
        });
      };

      ws.onclose = () => {
        setStatus({
          connected: false,
          ipAddress: null,
          latency: null
        });
        toast({
          title: "Connection Closed",
          description: "Connection to Raspberry Pi was closed",
        });
      };
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to Raspberry Pi. Please check the IP address and try again.",
        variant: "destructive"
      });
    }
  };

  const disconnectDevice = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setStatus({
      connected: false,
      ipAddress: null,
      latency: null
    });
    
    toast({
      title: "Disconnected",
      description: "Successfully disconnected from Raspberry Pi",
    });
  };

  return {
    status,
    connectToDevice,
    disconnectDevice
  };
};
