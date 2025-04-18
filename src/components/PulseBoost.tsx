
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Zap, RefreshCw, WifiOff, Wifi, Signal, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Initial network data
const initialNetworkData = [
  { time: '00:00', download: 35, upload: 10 },
  { time: '04:00', download: 28, upload: 8 },
  { time: '08:00', download: 52, upload: 15 },
  { time: '12:00', download: 78, upload: 20 },
  { time: '16:00', download: 65, upload: 18 },
  { time: '20:00', download: 90, upload: 22 },
  { time: '23:59', download: 45, upload: 12 },
];

export const PulseBoost = () => {
  // State for network metrics
  const [downloadSpeed, setDownloadSpeed] = useState(85);
  const [uploadSpeed, setUploadSpeed] = useState(22);
  const [ping, setPing] = useState(18);
  const [stability, setStability] = useState(95);
  const [devices, setDevices] = useState(8);
  const [activeOptimizations, setActiveOptimizations] = useState(3);
  const [networkData, setNetworkData] = useState(initialNetworkData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Simulated network fluctuation - generates realistic random changes to network metrics
  const updateNetworkMetrics = () => {
    // Random fluctuation within reasonable bounds
    setDownloadSpeed(prev => Math.max(20, Math.min(110, prev + (Math.random() - 0.5) * 20)));
    setUploadSpeed(prev => Math.max(5, Math.min(35, prev + (Math.random() - 0.5) * 8)));
    setPing(prev => Math.max(8, Math.min(40, prev + (Math.random() - 0.5) * 6)));
    setStability(prev => Math.max(80, Math.min(99, prev + (Math.random() - 0.5) * 5)));
    
    // Occasionally change device count (less frequently)
    if (Math.random() > 0.8) {
      const newDevices = Math.max(1, Math.min(12, devices + (Math.random() > 0.5 ? 1 : -1)));
      if (newDevices !== devices) {
        setDevices(newDevices);
        const action = newDevices > devices ? "connected to" : "disconnected from";
        toast({
          title: `Device ${action} network`,
          description: `${newDevices} devices now connected`,
        });
      }
    }
    
    // Occasionally change optimization count (rarely)
    if (Math.random() > 0.9) {
      const newOptimizations = Math.max(0, Math.min(5, activeOptimizations + (Math.random() > 0.6 ? 1 : -1)));
      if (newOptimizations !== activeOptimizations) {
        setActiveOptimizations(newOptimizations);
        const action = newOptimizations > activeOptimizations ? "enabled" : "disabled";
        toast({
          title: `Network optimization ${action}`,
          description: newOptimizations > activeOptimizations 
            ? "Network performance should improve"
            : "This may affect network performance",
          variant: newOptimizations > activeOptimizations ? "default" : "destructive",
        });
      }
    }
    
    // Update chart data - slide window and add new point
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0');
                      
    setNetworkData(prev => {
      const newData = [...prev.slice(1), {
        time: timeString,
        download: downloadSpeed,
        upload: uploadSpeed
      }];
      return newData;
    });
  };

  // Manual refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate network refresh with a slight delay
    setTimeout(() => {
      updateNetworkMetrics();
      setIsRefreshing(false);
      toast({
        title: "Network stats refreshed",
        description: `Download: ${downloadSpeed.toFixed(1)} Mbps, Upload: ${uploadSpeed.toFixed(1)} Mbps`,
      });
    }, 800);
  };

  // Periodic auto-refresh effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      updateNetworkMetrics();
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [devices, activeOptimizations]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Network Performance</CardTitle>
                <CardDescription>Live monitoring</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
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
                  animationDuration={500}
                />
                <Line 
                  type="monotone" 
                  dataKey="upload" 
                  name="Upload (Mbps)"
                  stroke="#0c3b5c" 
                  strokeWidth={2}
                  animationDuration={500}
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
                  <span className="font-bold transition-all duration-500">{downloadSpeed.toFixed(1)} Mbps</span>
                </div>
                <Progress value={downloadSpeed} max={100} className="h-2 transition-all duration-500" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <WifiOff className="text-shield" size={18} />
                    <span className="font-medium">Upload</span>
                  </div>
                  <span className="font-bold transition-all duration-500">{uploadSpeed.toFixed(1)} Mbps</span>
                </div>
                <Progress value={uploadSpeed * 3} max={100} className="h-2 transition-all duration-500" />
              </div>
              
              <div className="pt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ping</span>
                  <span className="font-medium transition-all duration-300">{ping.toFixed(0)} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stability</span>
                  <span className="font-medium transition-all duration-300">{stability.toFixed(1)}%</span>
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
                    <Zap size={20} className={activeOptimizations > 0 ? "animate-pulse" : ""} />
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
                  <span className="font-medium transition-all duration-300">{activeOptimizations}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Signal size={16} className="text-shield" />
                    <span className="text-sm">Connected Devices</span>
                  </div>
                  <span className="font-medium transition-all duration-300">{devices}</span>
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
