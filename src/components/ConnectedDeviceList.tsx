
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Laptop, Smartphone, Tv, Trash2, WifiOff, Wifi, Clock, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchDevices, updateDevice, removeDevice } from "@/services/networkService";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Device {
  id: string;
  name: string;
  type: "laptop" | "smartphone" | "tv" | "other";
  ip: string;
  mac: string;
  status: "online" | "offline";
  lastSeen: string;
  bandwidth: number; // in Mbps
  userId: string;
}

export const ConnectedDeviceList = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch devices from the database
  const { data: devices, isLoading, error } = useQuery({
    queryKey: ["devices", user?.id],
    queryFn: fetchDevices,
    enabled: !!user,
  });

  // Mutation for blocking a device
  const blockDeviceMutation = useMutation({
    mutationFn: (device: Device) => 
      updateDevice(device.id, { status: "offline" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });

  // Mutation for removing a device
  const removeDeviceMutation = useMutation({
    mutationFn: (deviceId: string) => removeDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading devices",
        description: "Failed to load your connected devices",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Handlers
  const blockDevice = (device: Device) => {
    blockDeviceMutation.mutate(device, {
      onSuccess: () => {
        toast({
          title: `${device.name} blocked`,
          description: `${device.name} has been blocked from your network`,
          variant: "default",
        });
      },
      onError: (error) => {
        toast({
          title: "Failed to block device",
          description: error instanceof Error ? error.message : "An error occurred",
          variant: "destructive",
        });
      },
    });
  };
  
  const handleRemoveDevice = (deviceId: string, deviceName: string) => {
    removeDeviceMutation.mutate(deviceId, {
      onSuccess: () => {
        toast({
          title: "Device removed",
          description: `${deviceName} has been removed from your network history`,
        });
      },
      onError: (error) => {
        toast({
          title: "Failed to remove device",
          description: error instanceof Error ? error.message : "An error occurred",
          variant: "destructive",
        });
      },
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
  
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return "Just now";
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // For simulating a fresh scan (will update to real network scan when backend is integrated)
  const refreshDevices = () => {
    queryClient.invalidateQueries({ queryKey: ["devices"] });
    toast({
      title: "Network scan initiated",
      description: "Checking for connected devices..."
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Connected Devices</CardTitle>
            <CardDescription>
              {devices?.filter(d => d.status === "online").length || 0} active devices
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={refreshDevices}
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
        ) : devices && devices.length > 0 ? (
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
                        onClick={() => handleRemoveDevice(device.id, device.name)}
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
