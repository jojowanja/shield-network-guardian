
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Laptop, Smartphone, Tv, Trash2, WifiOff, Wifi, Clock, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Device {
  id: string;
  name: string;
  type: "laptop" | "smartphone" | "tv" | "other";
  ip: string;
  mac: string;
  status: "online" | "offline";
  lastSeen: Date;
  bandwidth: number; // in Mbps
}

export const ConnectedDeviceList = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Simulate fetching devices on component mount
  useEffect(() => {
    fetchDevices();
    
    // Simulate periodic updates
    const interval = setInterval(() => {
      updateDevicesStatus();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  const generateMockDevices = (): Device[] => {
    // Realistic device types
    const deviceTypes: Array<{name: string, type: "laptop" | "smartphone" | "tv" | "other"}> = [
      { name: "MacBook Pro", type: "laptop" },
      { name: "Windows Laptop", type: "laptop" },
      { name: "iPhone 15", type: "smartphone" },
      { name: "Samsung Galaxy", type: "smartphone" },
      { name: "Samsung Smart TV", type: "tv" },
      { name: "Sony Bravia", type: "tv" },
      { name: "Amazon Echo", type: "other" },
      { name: "Nest Thermostat", type: "other" }
    ];
    
    const mockDevices: Device[] = [];
    
    // Generate 5-8 random devices
    const numDevices = Math.floor(Math.random() * 4) + 5;
    
    for (let i = 0; i < numDevices; i++) {
      const deviceInfo = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
      const isOnline = Math.random() > 0.2;
      
      mockDevices.push({
        id: `device-${i}`,
        name: deviceInfo.name,
        type: deviceInfo.type,
        ip: `192.168.1.${10 + i}`,
        mac: `00:1B:44:${Math.floor(Math.random() * 100).toString(16).padStart(2, '0')}:${Math.floor(Math.random() * 100).toString(16).padStart(2, '0')}:${Math.floor(Math.random() * 100).toString(16).padStart(2, '0')}`,
        status: isOnline ? "online" : "offline",
        lastSeen: new Date(Date.now() - (isOnline ? 0 : Math.random() * 3600000)),
        bandwidth: isOnline ? Math.random() * 15 : 0
      });
    }
    
    return mockDevices;
  };

  const fetchDevices = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockDevices = generateMockDevices();
    setDevices(mockDevices);
    setIsLoading(false);
    
    // Notify about active devices
    const activeDevices = mockDevices.filter(d => d.status === "online").length;
    toast({
      title: `${activeDevices} active devices detected`,
      description: `${mockDevices.length} total devices on your network`
    });
  };
  
  const updateDevicesStatus = () => {
    // Simulate some devices changing status or bandwidth usage
    setDevices(prev => {
      return prev.map(device => {
        // 10% chance to change status
        if (Math.random() > 0.9) {
          const newStatus = device.status === "online" ? "offline" : "online";
          
          // Notify about status changes
          if (device.status !== newStatus) {
            toast({
              title: `${device.name} is now ${newStatus}`,
              description: `Device ${newStatus === "online" ? "connected to" : "disconnected from"} your network`,
              variant: newStatus === "online" ? "default" : "destructive",
            });
          }
          
          return {
            ...device,
            status: newStatus,
            lastSeen: new Date(),
            bandwidth: newStatus === "online" ? Math.random() * 15 : 0
          };
        }
        
        // For online devices, update bandwidth
        if (device.status === "online") {
          return {
            ...device,
            bandwidth: Math.max(0.1, Math.min(25, device.bandwidth + (Math.random() - 0.5) * 5))
          };
        }
        
        return device;
      });
    });
  };

  const blockDevice = (device: Device) => {
    toast({
      title: `${device.name} blocked`,
      description: `${device.name} has been blocked from your network`,
      variant: "default",
    });
    
    setDevices(prev => 
      prev.map(d => d.id === device.id ? {...d, status: "offline"} : d)
    );
  };
  
  const removeDevice = (deviceId: string) => {
    setDevices(prev => prev.filter(d => d.id !== deviceId));
    
    toast({
      title: "Device removed",
      description: "Device has been removed from your network history",
    });
  };
  
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "laptop":
        return <Laptop className="h-5 w-5" />;
      case "smartphone":
        return <Smartphone className="h-5 w-5" />;
      case "tv":
        return <Tv className="h-5 w-5" />;
      default:
        return <Wifi className="h-5 w-5" />;
    }
  };
  
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return "Just now";
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Connected Devices</CardTitle>
            <CardDescription>
              {devices.filter(d => d.status === "online").length} active devices
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={fetchDevices}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            {isLoading ? "Scanning..." : "Scan Network"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="h-10 w-10 rounded-full bg-shield-accent/20 flex items-center justify-center text-shield-accent animate-pulse mb-3">
              <Wifi size={20} />
            </div>
            <p className="text-center text-muted-foreground">Scanning for connected devices...</p>
          </div>
        ) : devices.length > 0 ? (
          <div className="space-y-3">
            {devices.map(device => (
              <div 
                key={device.id}
                className={`border rounded-lg p-4 transition-all ${
                  device.status === "online" ? "border-status-safe/30" : "border-muted"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      device.status === "online" 
                        ? "bg-status-safe/20 text-status-safe" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {getDeviceIcon(device.type)}
                    </div>
                    <div>
                      <p className="font-medium">{device.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{device.ip}</span>
                        <span className="text-xs">•</span>
                        <div className="flex items-center gap-1">
                          {device.status === "online" 
                            ? <Wifi className="h-3 w-3" /> 
                            : <Clock className="h-3 w-3" />
                          }
                          <span>
                            {device.status === "online" 
                              ? "Online" 
                              : `Last seen ${formatTimeAgo(device.lastSeen)}`
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {device.status === "online" && (
                      <div className="text-right mr-4">
                        <p className="text-sm font-medium">{device.bandwidth.toFixed(1)} Mbps</p>
                        <p className="text-xs text-muted-foreground">Current usage</p>
                      </div>
                    )}
                    
                    <div className="flex gap-1">
                      {device.status === "online" && (
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => blockDevice(device)}
                          title="Block device"
                        >
                          <Ban className="h-4 w-4" />
                          <span className="sr-only">Block device</span>
                        </Button>
                      )}
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => removeDevice(device.id)}
                        title="Remove device"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove device</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <WifiOff className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p>No devices found on your network</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try scanning again or check your connection
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
