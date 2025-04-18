
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Zap, RefreshCw, WifiOff, Wifi, Signal, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Simulated network speed data
const networkData = [
  { time: '00:00', download: 35, upload: 10 },
  { time: '04:00', download: 28, upload: 8 },
  { time: '08:00', download: 52, upload: 15 },
  { time: '12:00', download: 78, upload: 20 },
  { time: '16:00', download: 65, upload: 18 },
  { time: '20:00', download: 90, upload: 22 },
  { time: '23:59', download: 45, upload: 12 },
];

export const PulseBoost = () => {
  // Simulated network metrics
  const downloadSpeed = 85;
  const uploadSpeed = 22;
  const ping = 18;
  const stability = 95;
  const devices = 8;
  const activeOptimizations = 3;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Network Performance</CardTitle>
                <CardDescription>24-hour monitoring</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw size={16} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={networkData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="download" 
                  name="Download (Mbps)"
                  stroke="#00a5cf" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="upload" 
                  name="Upload (Mbps)"
                  stroke="#0c3b5c" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <div className="w-full lg:w-1/3 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Current Speeds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Wifi className="text-shield-accent" size={18} />
                    <span className="font-medium">Download</span>
                  </div>
                  <span className="font-bold">{downloadSpeed} Mbps</span>
                </div>
                <Progress value={downloadSpeed} max={100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <WifiOff className="text-shield" size={18} />
                    <span className="font-medium">Upload</span>
                  </div>
                  <span className="font-bold">{uploadSpeed} Mbps</span>
                </div>
                <Progress value={uploadSpeed * 3} max={100} className="h-2" />
              </div>
              
              <div className="pt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ping</span>
                  <span className="font-medium">{ping} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stability</span>
                  <span className="font-medium">{stability}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pulse Boost</CardTitle>
              <CardDescription>Active network optimizations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-shield-accent/20 flex items-center justify-center text-shield-accent">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Boost Status</p>
                    <p className="text-sm text-status-safe">Active</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              
              <div className="pt-2 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-shield" />
                    <span className="text-sm">Optimizations Active</span>
                  </div>
                  <span className="font-medium">{activeOptimizations}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Signal size={16} className="text-shield" />
                    <span className="text-sm">Connected Devices</span>
                  </div>
                  <span className="font-medium">{devices}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Optimization Recommendations</CardTitle>
          <CardDescription>Improve your network performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-status-warning/20 flex items-center justify-center text-status-warning">
                <Signal size={20} />
              </div>
              <div>
                <p className="font-medium">Channel Optimization</p>
                <p className="text-sm text-muted-foreground">Your WiFi channel overlaps with 3 nearby networks. Switching to channel 11 could improve performance.</p>
              </div>
            </div>
            <Button className="bg-shield hover:bg-shield-secondary">Apply</Button>
          </div>
          
          <div className="border rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-status-safe/20 flex items-center justify-center text-status-safe">
                <Wifi size={20} />
              </div>
              <div>
                <p className="font-medium">QoS Settings</p>
                <p className="text-sm text-muted-foreground">Prioritize video conferencing and gaming traffic for improved responsiveness.</p>
              </div>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
