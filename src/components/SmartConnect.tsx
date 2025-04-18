
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Wifi, WifiOff, Router, Fingerprint, Eye, EyeOff } from "lucide-react";

export const SmartConnect = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [guestNetworkEnabled, setGuestNetworkEnabled] = useState(true);
  const [showGuestPassword, setShowGuestPassword] = useState(false);
  
  // Simulated network data
  const mainNetwork = {
    ssid: "Shield_Home_Network",
    password: "StrongP@ssw0rd123!",
    encryption: "WPA3",
    band: "Dual Band (2.4GHz & 5GHz)",
    channel: "Auto (Currently: 6, 36)",
    connectedDevices: 8
  };
  
  const guestNetwork = {
    ssid: "Shield_Guest",
    password: "Welcome2Shield!",
    encryption: "WPA2",
    validHours: 12,
    connectedDevices: 2,
    internetOnly: true
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="main-network" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="main-network">Main Network</TabsTrigger>
          <TabsTrigger value="guest-network">Guest Network</TabsTrigger>
        </TabsList>
        
        <TabsContent value="main-network">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <Wifi className="text-shield-accent" />
                      Main Network
                    </CardTitle>
                    <CardDescription>Configure your primary WiFi network</CardDescription>
                  </div>
                  <div className="network-pulse">
                    <div className="dot bg-status-safe"></div>
                    <div className="ring bg-status-safe animate-pulse-ring"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="network-name">Network Name (SSID)</Label>
                    <Input id="network-name" value={mainNetwork.ssid} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="encryption">Encryption Type</Label>
                    <Input id="encryption" value={mainNetwork.encryption} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        value={mainNetwork.password} 
                      />
                      <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="band">Frequency Band</Label>
                    <Input id="band" value={mainNetwork.band} />
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <Label className="mb-3 block">Advanced Settings</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Smart Channel Selection</p>
                        <p className="text-sm text-muted-foreground">Automatically select the best channel</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Band Steering</p>
                        <p className="text-sm text-muted-foreground">Guide devices to best frequency</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-shield hover:bg-shield-secondary">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Network Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <div className="status-indicator text-status-safe">
                    <span className="dot bg-status-safe"></span>
                    <span>Online</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Current Channel</span>
                  <span>{mainNetwork.channel}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Connected Devices</span>
                  <span>{mainNetwork.connectedDevices}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Uptime</span>
                  <span>3d 14h 22m</span>
                </div>
                
                <div className="flex flex-col mt-4 gap-2">
                  <Button size="sm" className="w-full">Test Speed</Button>
                  <Button size="sm" variant="outline" className="w-full">Restart Network</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="guest-network">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Fingerprint className="text-shield-accent" />
                    Guest Network
                  </CardTitle>
                  <CardDescription>Secure access for visitors</CardDescription>
                </div>
                <Switch 
                  checked={guestNetworkEnabled} 
                  onCheckedChange={setGuestNetworkEnabled} 
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {guestNetworkEnabled ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="guest-network-name">Guest Network Name</Label>
                      <Input id="guest-network-name" value={guestNetwork.ssid} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guest-encryption">Encryption Type</Label>
                      <Input id="guest-encryption" value={guestNetwork.encryption} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guest-password">Password</Label>
                      <div className="relative">
                        <Input 
                          id="guest-password" 
                          type={showGuestPassword ? "text" : "password"} 
                          value={guestNetwork.password} 
                        />
                        <button 
                          onClick={() => setShowGuestPassword(!showGuestPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showGuestPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valid-hours">Valid For (Hours)</Label>
                      <Input id="valid-hours" type="number" value={guestNetwork.validHours} />
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <Label className="mb-3 block">Access Restrictions</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Internet Only</p>
                          <p className="text-sm text-muted-foreground">No access to local devices</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Bandwidth Limit</p>
                          <p className="text-sm text-muted-foreground">Cap guest speed at 25 Mbps</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col mt-4 gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Connected Guests</span>
                      <span>{guestNetwork.connectedDevices}</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">Reset Guest Network</Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <WifiOff size={48} className="text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Guest Network is Disabled</p>
                  <p className="text-muted-foreground mb-4">Toggle the switch to enable guest access</p>
                  <div className="flex gap-4">
                    <Button 
                      className="bg-shield hover:bg-shield-secondary"
                      onClick={() => setGuestNetworkEnabled(true)}
                    >
                      Enable Guest Network
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Connection Details</CardTitle>
          <CardDescription>Internet service provider information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full bg-shield/20 flex items-center justify-center text-shield">
                <Router size={20} />
              </div>
              <div>
                <p className="font-medium">Internet Provider</p>
                <p className="text-sm">Spectrum High Speed</p>
                <p className="text-xs text-muted-foreground">Account: 58372-12</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full bg-shield/20 flex items-center justify-center text-shield">
                <Wifi size={20} />
              </div>
              <div>
                <p className="font-medium">Connection Type</p>
                <p className="text-sm">Fiber Optic</p>
                <p className="text-xs text-muted-foreground">Plan: 300 Mbps Down / 25 Mbps Up</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
