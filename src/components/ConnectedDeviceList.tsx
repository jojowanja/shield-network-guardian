
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DeviceManagement } from "@/components/DeviceManagement";
import { useRaspberryPi } from "@/hooks/useRaspberryPi";
import { NewDeviceAlert } from "@/components/NewDeviceAlert";
import { fetchDevices } from "@/services/networkService";
import { useQuery } from "@tanstack/react-query";

export const ConnectedDeviceList = () => {
  const [alertDevice, setAlertDevice] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [knownMACs, setKnownMACs] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { status } = useRaspberryPi();
  
  // Fetch devices from API
  const { data: devices, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: fetchDevices,
  });
  
  // Update known MACs whenever devices data changes
  useEffect(() => {
    if (devices) {
      const macs = new Set(devices.map((device: any) => device.mac.toLowerCase()));
      setKnownMACs(macs);
    }
  }, [devices]);
  
  // Set up WebSocket listener for new devices
  useEffect(() => {
    if (!status.connected) return;
    
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle suspicious device alerts
        if (data.type === 'suspicious_device') {
          const deviceInfo = data.deviceInfo;
          
          // Check if this is a new device we haven't seen before
          if (deviceInfo && deviceInfo.mac && !knownMACs.has(deviceInfo.mac.toLowerCase())) {
            // Show a toast alert
            toast({
              title: "New Device Detected",
              description: `Unknown device connected to your network: ${deviceInfo.hostname || deviceInfo.mac}`,
              duration: 10000,
            });
            
            // Set the device for the alert dialog
            setAlertDevice({
              id: `new-${Date.now()}`,
              ...deviceInfo
            });
            setShowAlert(true);
          }
        }
        
        // Handle regular device scans
        if (data.type === 'device_scan' && data.devices) {
          data.devices.forEach((device: any) => {
            if (device.mac && !knownMACs.has(device.mac.toLowerCase())) {
              // New device found in scan
              toast({
                title: "New Device Detected",
                description: `Unknown device connected to your network: ${device.hostname || device.mac}`,
              });
              
              // Show only one alert at a time
              if (!alertDevice) {
                setAlertDevice({
                  id: `new-${Date.now()}`,
                  ...device
                });
                setShowAlert(true);
              }
            }
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    // Access the WebSocket via the Raspberry Pi hook's ref
    if (window.raspberryPiWebSocket) {
      window.raspberryPiWebSocket.addEventListener('message', handleMessage);
    }
    
    return () => {
      if (window.raspberryPiWebSocket) {
        window.raspberryPiWebSocket.removeEventListener('message', handleMessage);
      }
    };
  }, [status.connected, knownMACs, toast, alertDevice]);
  
  return (
    <>
      <DeviceManagement />
      
      {/* New Device Alert Dialog */}
      {alertDevice && (
        <NewDeviceAlert 
          device={alertDevice}
          open={showAlert}
          onOpenChange={setShowAlert}
        />
      )}
    </>
  );
};
