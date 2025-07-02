
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
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
          <Card>
            <CardHeader>
              <CardTitle>Network Settings</CardTitle>
              <CardDescription>
                Configure your network monitoring preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="real-time">Real-time Monitoring</Label>
                <Switch id="real-time" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Push Notifications</Label>
                <Switch id="notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-scan">Auto Device Scanning</Label>
                <Switch id="auto-scan" defaultChecked />
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

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security monitoring and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="intrusion-detection">Intrusion Detection</Label>
                <Switch id="intrusion-detection" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="device-alerts">New Device Alerts</Label>
                <Switch id="device-alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="security-alerts">Security Alerts</Label>
                <Switch id="security-alerts" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>Save Settings</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
