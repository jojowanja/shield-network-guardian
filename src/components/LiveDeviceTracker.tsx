
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Wifi, Shield, Edit, Ban, AlertTriangle } from "lucide-react";

interface Device {
  id: string;
  name: string;
  mac: string;
  ip: string;
  isNew: boolean;
  isBlocked: boolean;
  lastSeen: Date;
  deviceType: string;
}

export const LiveDeviceTracker = () => {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "1",
      name: "John's MacBook Pro",
      mac: "A1:B2:C3:D4:E5:F6",
      ip: "192.168.1.5",
      isNew: false,
      isBlocked: false,
      lastSeen: new Date(),
      deviceType: "laptop"
    },
    {
      id: "2",
      name: "Unknown Device",
      mac: "G7:H8:I9:J0:K1:L2",
      ip: "192.168.1.15",
      isNew: true,
      isBlocked: false,
      lastSeen: new Date(),
      deviceType: "unknown"
    }
  ]);
  
  const [renameDevice, setRenameDevice] = useState<Device | null>(null);
  const [newName, setNewName] = useState("");
  const { toast } = useToast();

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => prev.map(device => ({
        ...device,
        lastSeen: Math.random() > 0.7 ? new Date() : device.lastSeen
      })));
      
      // Occasionally add new devices
      if (Math.random() > 0.95) {
        const newDevice: Device = {
          id: Date.now().toString(),
          name: "New Device",
          mac: `${Math.random().toString(36).substr(2, 2).toUpperCase()}:${Math.random().toString(36).substr(2, 2).toUpperCase()}:${Math.random().toString(36).substr(2, 2).toUpperCase()}:${Math.random().toString(36).substr(2, 2).toUpperCase()}:${Math.random().toString(36).substr(2, 2).toUpperCase()}:${Math.random().toString(36).substr(2, 2).toUpperCase()}`,
          ip: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
          isNew: true,
          isBlocked: false,
          lastSeen: new Date(),
          deviceType: "unknown"
        };
        
        setDevices(prev => [...prev, newDevice]);
        toast({
          title: "New Device Detected!",
          description: `Unknown device connected: ${newDevice.ip}`,
          variant: "destructive"
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [toast]);

  const handleBlockDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId ? { ...device, isBlocked: !device.isBlocked } : device
    ));
    
    const device = devices.find(d => d.id === deviceId);
    toast({
      title: device?.isBlocked ? "Device Unblocked" : "Device Blocked",
      description: `${device?.name} has been ${device?.isBlocked ? 'unblocked' : 'blocked'}`,
    });
  };

  const handleRenameDevice = (device: Device) => {
    setRenameDevice(device);
    setNewName(device.name);
  };

  const saveRename = () => {
    if (renameDevice && newName.trim()) {
      setDevices(prev => prev.map(device => 
        device.id === renameDevice.id ? { ...device, name: newName.trim(), isNew: false } : device
      ));
      
      toast({
        title: "Device Renamed",
        description: `Device renamed to "${newName}"`,
      });
      
      setRenameDevice(null);
      setNewName("");
    }
  };

  const getDeviceStatusBadge = (device: Device) => {
    if (device.isBlocked) {
      return <Badge variant="destructive">Blocked</Badge>;
    }
    if (device.isNew) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">New</Badge>;
    }
    return <Badge variant="outline" className="bg-green-100 text-green-800">Connected</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="text-blue-500" />
          Live Device Tracker
        </CardTitle>
        <CardDescription>
          Monitor connected devices in real-time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {devices.map((device) => (
            <div 
              key={device.id} 
              className={`p-4 border rounded-lg ${device.isNew ? 'border-yellow-400 bg-yellow-50' : device.isBlocked ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  {device.isNew && <AlertTriangle className="text-yellow-500 mt-1" size={20} />}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{device.name}</p>
                      {getDeviceStatusBadge(device)}
                    </div>
                    <p className="text-sm text-gray-600">MAC: {device.mac}</p>
                    <p className="text-sm text-gray-600">IP: {device.ip}</p>
                    <p className="text-xs text-gray-500">
                      Last seen: {device.lastSeen.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRenameDevice(device)}
                      >
                        <Edit size={16} className="mr-1" />
                        Rename
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Rename Device</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="device-name">Device Name</Label>
                          <Input
                            id="device-name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Enter device name"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setRenameDevice(null)}>
                            Cancel
                          </Button>
                          <Button onClick={saveRename}>
                            Save
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant={device.isBlocked ? "outline" : "destructive"}
                    size="sm"
                    onClick={() => handleBlockDevice(device.id)}
                  >
                    <Ban size={16} className="mr-1" />
                    {device.isBlocked ? "Unblock" : "Block"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
