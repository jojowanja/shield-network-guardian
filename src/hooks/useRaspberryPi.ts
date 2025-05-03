import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useNetworkStats } from "@/hooks/useNetworkStats";

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
  const { updateStats } = useNetworkStats();

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
          
          // Update latency status
          if (data.latency) {
            setStatus(prev => ({
              ...prev,
              latency: data.latency || prev.latency
            }));
          }
          
          // Handle speed test results
          if (data.downloadSpeed && data.uploadSpeed && data.ping) {
            updateStats({
              downloadSpeed: data.downloadSpeed,
              uploadSpeed: data.uploadSpeed,
              ping: data.ping,
              // Keep other stats from current state
            });
            
            toast({
              title: "Speed Test Complete",
              description: `Download: ${data.downloadSpeed.toFixed(1)} Mbps, Upload: ${data.uploadSpeed.toFixed(1)} Mbps`,
            });
          }
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
  
  const requestSpeedTest = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send('speedtest');
      toast({
        title: "Speed Test Started",
        description: "Running speed test on Raspberry Pi...",
      });
      return true;
    }
    return false;
  };

  return {
    status,
    connectToDevice,
    disconnectDevice,
    requestSpeedTest
  };
};
