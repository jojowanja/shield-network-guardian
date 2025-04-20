
import { useState, useEffect } from 'react';
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
  const { toast } = useToast();

  const connectToDevice = async (ipAddress: string) => {
    try {
      // Simulate connecting to Raspberry Pi (in production, replace with actual WebSocket connection)
      const response = await fetch(`http://${ipAddress}:3000/status`);
      
      if (response.ok) {
        setStatus({
          connected: true,
          ipAddress,
          latency: Math.random() * 20 + 5 // Simulated latency between 5-25ms
        });
        
        toast({
          title: "Connected to Raspberry Pi",
          description: `Successfully connected to device at ${ipAddress}`,
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to Raspberry Pi. Please check the IP address and try again.",
        variant: "destructive"
      });
    }
  };

  const disconnectDevice = () => {
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
