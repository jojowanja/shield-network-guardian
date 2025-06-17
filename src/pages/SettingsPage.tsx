import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Shield, Bell, Lock, Database, Clock, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();

  const handleSaveChanges = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="text-shield-accent" />
              Settings
            </h1>
            <p className="text-muted-foreground">Configure your Shield Network Guardian</p>
          </div>
        </div>
        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage application preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="app-name">Dashboard Name</Label>
                    <Input id="app-name" placeholder="Shield Network Guardian" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time-zone">Time Zone</Label>
                    <Input id="time-zone" placeholder="UTC-5 (Eastern Time)" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Input id="language" placeholder="English (US)" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Input id="date-format" placeholder="MM/DD/YYYY" />
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <Label className="mb-3 block">Display Settings</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">Use dark theme</p>
                      </div>
                      <Switch 
                        checked={theme === "dark"} 
                        onCheckedChange={toggleTheme}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">High Contrast</p>
                        <p className="text-sm text-muted-foreground">Increase visibility</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button variant="outline">Reset</Button>
                  <Button 
                    className="bg-shield hover:bg-shield-secondary"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="text-shield" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Admin Password</Label>
                    <div className="flex gap-2">
                      <Input id="admin-password" type="password" value="••••••••••••" />
                      <Button variant="outline">Change</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <div className="flex items-center justify-between p-3 rounded-md bg-gray-50 dark:bg-muted/40">
                      <span>Not Configured</span>
                      <Button variant="outline" size="sm">Set Up</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <Label className="mb-3 block">Security Features</Label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Automatic Updates</p>
                        <p className="text-sm text-muted-foreground">Keep security definitions current</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Threat Detection</p>
                        <p className="text-sm text-muted-foreground">Scan network for suspicious activity</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Access Logs</p>
                        <p className="text-sm text-muted-foreground">Record login attempts and changes</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button variant="outline">Reset</Button>
                  <Button className="bg-shield hover:bg-shield-secondary">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="text-shield" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Security Alerts</p>
                      <p className="text-sm text-muted-foreground">Notify about potential security threats</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Device Connections</p>
                      <p className="text-sm text-muted-foreground">Alert when new devices join network</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Network Status Changes</p>
                      <p className="text-sm text-muted-foreground">Notify about connectivity issues</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System Updates</p>
                      <p className="text-sm text-muted-foreground">Alerts about available updates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <Label className="mb-3 block">Notification Methods</Label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked />
                        <Button variant="outline" size="sm">Change</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">To mobile device</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked />
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Alerts</p>
                        <p className="text-sm text-muted-foreground">For critical security threats only</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch />
                        <Button variant="outline" size="sm">Set Up</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="text-shield" />
                    System Information
                  </CardTitle>
                  <CardDescription>Hardware and software details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">System Version</p>
                      <p className="font-medium">Shield Network Guardian v1.0.0</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="font-medium">May 15, 2025</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Hardware Model</p>
                      <p className="font-medium">Raspberry Pi 4 Model B</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Memory</p>
                      <p className="font-medium">4GB RAM</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Storage</p>
                      <p className="font-medium">32GB (60% Available)</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Network Interface</p>
                      <p className="font-medium">Ethernet + WiFi</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <Label className="mb-3 block">System Maintenance</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button variant="outline" className="gap-2">
                        <Database size={16} />
                        Backup System
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <CheckCircle size={16} />
                        Check for Updates
                      </Button>
                      <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
                        <Clock size={16} />
                        Restart System
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>CPU Usage</span>
                      <span className="font-medium">23%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-shield-accent h-2 rounded-full w-[23%]"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Memory Usage</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-shield-accent h-2 rounded-full w-[45%]"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Storage Usage</span>
                      <span className="font-medium">40%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-shield-accent h-2 rounded-full w-[40%]"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Temperature</span>
                      <span className="font-medium">42°C</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-shield-accent h-2 rounded-full w-[42%]"></div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">System Uptime</p>
                    <p className="font-medium">3 days, 14 hours, 22 minutes</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
