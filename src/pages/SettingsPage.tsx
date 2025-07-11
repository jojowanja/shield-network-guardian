
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";

const SettingsPage = () => {
  const { toast } = useToast();
  const { isPremium } = useSubscription();
  const [settings, setSettings] = useState({
    realTime: true,
    notifications: true,
    autoScan: true,
    intrusionDetection: true,
    deviceAlerts: true,
    securityAlerts: true,
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Setting Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} has been ${value ? 'enabled' : 'disabled'}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your network preferences and account settings
          </p>
        </div>
        
        <div className="grid gap-6">
          <Card className={isPremium ? "premium-card" : "basic-card"}>
            <CardHeader>
              <CardTitle>Network Settings</CardTitle>
              <CardDescription>
                Configure your network monitoring preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="real-time">Real-time Monitoring</Label>
                <Switch 
                  id="real-time" 
                  checked={settings.realTime}
                  onCheckedChange={(checked) => handleSettingChange('realTime', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Push Notifications</Label>
                <Switch 
                  id="notifications" 
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-scan">Auto Device Scanning</Label>
                <Switch 
                  id="auto-scan" 
                  checked={settings.autoScan}
                  onCheckedChange={(checked) => handleSettingChange('autoScan', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Raspberry Pi Configuration</CardTitle>
              <CardDescription>
                Configure your Raspberry Pi connection settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pi-ip">Default Raspberry Pi IP</Label>
                <Input 
                  id="pi-ip" 
                  placeholder="192.168.1.100" 
                  defaultValue=""
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scan-interval">Scan Interval (seconds)</Label>
                <Input 
                  id="scan-interval" 
                  type="number" 
                  placeholder="30" 
                  defaultValue="30"
                />
              </div>
            </CardContent>
          </Card>

          <Card className={isPremium ? "premium-card" : "basic-card"}>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security monitoring and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="intrusion-detection">Intrusion Detection</Label>
                <Switch 
                  id="intrusion-detection" 
                  checked={settings.intrusionDetection}
                  onCheckedChange={(checked) => handleSettingChange('intrusionDetection', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="device-alerts">New Device Alerts</Label>
                <Switch 
                  id="device-alerts" 
                  checked={settings.deviceAlerts}
                  onCheckedChange={(checked) => handleSettingChange('deviceAlerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="security-alerts">Security Alerts</Label>
                <Switch 
                  id="security-alerts" 
                  checked={settings.securityAlerts}
                  onCheckedChange={(checked) => handleSettingChange('securityAlerts', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className={isPremium ? "premium-button" : "basic-button"}>
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
