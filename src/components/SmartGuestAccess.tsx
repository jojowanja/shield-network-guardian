
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { generateStrongPassword } from "@/utils/passwordUtils";
import { Eye, EyeOff, Clock, Wifi, WifiOff, User, Timer } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GuestDevice {
  id: string;
  name: string;
  macAddress: string;
  connectedAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

export const SmartGuestAccess = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [guestNetworkEnabled, setGuestNetworkEnabled] = useState(true);
  const [guestSSID, setGuestSSID] = useState("Shield_Guest");
  const [guestPassword, setGuestPassword] = useState("Welcome123");
  const [expiryDuration, setExpiryDuration] = useState("60");
  const [guestDevices, setGuestDevices] = useState<GuestDevice[]>([
    {
      id: "1",
      name: "iPhone 13",
      macAddress: "AA:BB:CC:11:22:33",
      connectedAt: new Date(Date.now() - 45 * 60000), // 45 minutes ago
      expiresAt: new Date(Date.now() + 15 * 60000),   // 15 minutes from now
      isActive: true
    },
    {
      id: "2",
      name: "Samsung Galaxy",
      macAddress: "DD:EE:FF:44:55:66",
      connectedAt: new Date(Date.now() - 10 * 60000), // 10 minutes ago
      expiresAt: new Date(Date.now() + 50 * 60000),   // 50 minutes from now
      isActive: true
    },
    {
      id: "3",
      name: "iPad Pro",
      macAddress: "11:22:33:AA:BB:CC",
      connectedAt: new Date(Date.now() - 3 * 3600000), // 3 hours ago
      expiresAt: new Date(Date.now() - 30 * 60000),    // expired 30 minutes ago
      isActive: false
    }
  ]);
  
  const generateNewPassword = () => {
    const newPassword = generateStrongPassword(10, true, true, true);
    setGuestPassword(newPassword);
  };
  
  const disconnectDevice = (deviceId: string) => {
    setGuestDevices(prev => prev.map(device => 
      device.id === deviceId ? {...device, isActive: false, expiresAt: new Date()} : device
    ));
  };
  
  const resetGuestNetwork = () => {
    generateNewPassword();
    setGuestDevices(prev => prev.map(device => ({...device, isActive: false, expiresAt: new Date()})));
  };
  
  const activeDeviceCount = guestDevices.filter(device => device.isActive).length;
  const totalSessionTime = guestDevices.reduce((total, device) => {
    const connected = device.connectedAt.getTime();
    const expired = device.isActive ? Date.now() : device.expiresAt.getTime();
    return total + (expired - connected);
  }, 0);
  
  // Format total session time
  const formatTotalTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };
  
  const expiryOptions = [
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
    { value: "120", label: "2 hours" },
    { value: "240", label: "4 hours" },
    { value: "480", label: "8 hours" },
    { value: "1440", label: "24 hours" }
  ];
  
  // Calculate remaining time for active devices
  const getRemainingTime = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    
    if (diff <= 0) return "Expired";
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="text-blue-500" />
              Smart Guest Access
            </CardTitle>
            <CardDescription>
              Manage temporary access to your WiFi network
            </CardDescription>
          </div>
          <Switch 
            checked={guestNetworkEnabled}
            onCheckedChange={setGuestNetworkEnabled}
          />
        </div>
      </CardHeader>
      <CardContent>
        {guestNetworkEnabled ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guest-ssid">Guest Network Name</Label>
                <Input
                  id="guest-ssid"
                  value={guestSSID}
                  onChange={(e) => setGuestSSID(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry-duration">Access Duration</Label>
                <Select value={expiryDuration} onValueChange={setExpiryDuration}>
                  <SelectTrigger id="expiry-duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {expiryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="guest-password">Guest Password</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="guest-password"
                    type={showPassword ? "text" : "password"}
                    value={guestPassword}
                    onChange={(e) => setGuestPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <Button type="button" variant="outline" onClick={generateNewPassword}>
                  Generate
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3">
                <div className="text-xs text-blue-600 dark:text-blue-400">Active Guests</div>
                <div className="text-xl font-semibold flex items-center gap-1">
                  <User size={16} />
                  {activeDeviceCount}
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3">
                <div className="text-xs text-green-600 dark:text-green-400">Password Changes</div>
                <div className="text-xl font-semibold">3</div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-lg p-3">
                <div className="text-xs text-yellow-600 dark:text-yellow-400">Access Sessions</div>
                <div className="text-xl font-semibold">{guestDevices.length}</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-3">
                <div className="text-xs text-purple-600 dark:text-purple-400">Total Guest Time</div>
                <div className="text-xl font-semibold flex items-center gap-1">
                  <Clock size={16} />
                  {formatTotalTime(totalSessionTime)}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Connected Guests</h3>
                <Badge variant="outline" className="font-normal">
                  {activeDeviceCount} active
                </Badge>
              </div>
              
              <ScrollArea className="h-64 rounded-md border">
                <div className="divide-y">
                  {guestDevices.length > 0 ? (
                    guestDevices.map((device) => (
                      <div key={device.id} className="flex items-center justify-between p-3 hover:bg-muted">
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 h-2 w-2 rounded-full ${device.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                          <div>
                            <p className="font-medium">{device.name}</p>
                            <p className="text-xs text-muted-foreground">{device.macAddress}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock size={12} className="mr-1" />
                                {new Date(device.connectedAt).toLocaleTimeString()}
                              </div>
                              {device.isActive && (
                                <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                                  <Timer size={12} className="mr-1" />
                                  {getRemainingTime(device.expiresAt)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {device.isActive && (
                          <Button 
                            size="sm"
                            variant="destructive"
                            className="h-7"
                            onClick={() => disconnectDevice(device.id)}
                          >
                            <WifiOff size={14} className="mr-1" /> Disconnect
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-center text-muted-foreground">
                      No guest devices have connected
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetGuestNetwork}>
                Reset Guest Network
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Apply Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <WifiOff size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Guest Network is Disabled</h3>
            <p className="text-muted-foreground text-center mb-6">
              Enable the guest network to provide temporary access to visitors<br />
              without sharing your main WiFi password.
            </p>
            <Button onClick={() => setGuestNetworkEnabled(true)}>
              <Wifi className="mr-2" /> Enable Guest Access
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
