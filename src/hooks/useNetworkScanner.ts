
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { backendNetworkService } from '@/services/backendNetworkService';
import { useAuth } from '@/contexts/AuthContext';

interface ScannedDevice {
  ip: string;
  mac: string;
  hostname?: string;
  vendor?: string;
  type: 'laptop' | 'smartphone' | 'tv' | 'other';
  isNew: boolean;
  lastSeen: Date;
}

export const useNetworkScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDevices, setScannedDevices] = useState<ScannedDevice[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  // Simulate real-time network scanning
  const performNetworkScan = useCallback(async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const simulatedDevices: Omit<ScannedDevice, 'isNew' | 'lastSeen'>[] = [
      { ip: '192.168.1.105', mac: 'AA:BB:CC:11:22:33', hostname: 'Joy-iPhone', vendor: 'Apple', type: 'smartphone' },
      { ip: '192.168.1.110', mac: 'DD:EE:FF:44:55:66', hostname: 'Smart-TV-Living', vendor: 'Samsung', type: 'tv' },
      { ip: '192.168.1.115', mac: '11:22:33:AA:BB:CC', hostname: 'John-Laptop', vendor: 'Dell', type: 'laptop' },
      { ip: '192.168.1.120', mac: '44:55:66:DD:EE:FF', hostname: 'Guest-Device', vendor: 'Unknown', type: 'other' },
    ];

    // Simulate progressive scanning
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setScanProgress(i);
    }

    // Get existing devices from storage or previous scans
    const existingMacs = new Set(scannedDevices.map(d => d.mac));
    
    const devicesWithStatus = simulatedDevices.map(device => ({
      ...device,
      isNew: !existingMacs.has(device.mac),
      lastSeen: new Date()
    }));

    const newDevices = devicesWithStatus.filter(d => d.isNew);
    
    setScannedDevices(devicesWithStatus);
    setIsScanning(false);
    setScanProgress(100);

    // Show notifications for new devices
    if (newDevices.length > 0) {
      toast({
        title: `${newDevices.length} new device${newDevices.length > 1 ? 's' : ''} detected`,
        description: `${newDevices.map(d => d.hostname || d.ip).join(', ')} connected to your network`,
      });

      // Log to security events if user is authenticated
      if (user) {
        try {
          for (const device of newDevices) {
            await backendNetworkService.addSecurityEvent({
              deviceId: null,
              eventType: 'new_device',
              severity: 'medium',
              description: `New device detected: ${device.hostname || device.ip} (${device.mac})`,
              timestamp: new Date().toISOString(),
              resolved: false
            });
          }
        } catch (error) {
          console.error('Error logging security events:', error);
        }
      }
    }

    return devicesWithStatus;
  }, [scannedDevices, toast]);

  // Auto-scan every 30 seconds when component is active
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isScanning) {
        performNetworkScan();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [performNetworkScan, isScanning]);

  const startManualScan = () => {
    performNetworkScan();
  };

  return {
    isScanning,
    scannedDevices,
    scanProgress,
    startManualScan,
    performNetworkScan
  };
};
