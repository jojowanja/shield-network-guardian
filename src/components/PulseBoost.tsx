import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Zap, RefreshCw, WifiOff, Wifi, Signal, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from "react";
import { useNetworkStats } from "@/hooks/useNetworkStats";
import { OptimizationSuggestion } from "@/components/OptimizationSuggestion";
import { useToast } from "@/hooks/use-toast";

export const PulseBoost = () => {
  const { stats, updateStats } = useNetworkStats();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [networkData, setNetworkData] = useState([]);

  useEffect(() => {
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0');
                      
    setNetworkData(prev => {
      const newData = [...prev.slice(-6), {
        time: timeString,
        download: stats.downloadSpeed,
        upload: stats.uploadSpeed
      }];
      return newData;
    });
  }, [stats]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await updateStats();
    setIsRefreshing(false);
    toast({
      title: "Network stats refreshed",
      description: `Download: ${stats.downloadSpeed.toFixed(1)} Mbps, Upload: ${stats.uploadSpeed.toFixed(1)} Mbps`,
    });
  };

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
                  <span className="font-bold transition-all duration-500">{stats.downloadSpeed.toFixed(1)} Mbps</span>
                </div>
                <Progress value={stats.downloadSpeed} max={100} className="h-2 transition-all duration-500" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <WifiOff className="text-shield" size={18} />
                    <span className="font-medium">Upload</span>
                  </div>
                  <span className="font-bold transition-all duration-500">{stats.uploadSpeed.toFixed(1)} Mbps</span>
                </div>
                <Progress value={stats.uploadSpeed * 3} max={100} className="h-2 transition-all duration-500" />
              </div>
              
              <div className="pt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ping</span>
                  <span className="font-medium transition-all duration-300">{stats.ping.toFixed(0)} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stability</span>
                  <span className="font-medium transition-all duration-300">{stats.stability.toFixed(1)}%</span>
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
                    <Zap size={20} className={stats.activeOptimizations > 0 ? "animate-pulse" : ""} />
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
                  <span className="font-medium transition-all duration-300">{stats.activeOptimizations}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Signal size={16} className="text-shield" />
                    <span className="text-sm">Connected Devices</span>
                  </div>
                  <span className="font-medium transition-all duration-300">{stats.devices}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Optimization Suggestions</CardTitle>
          <CardDescription>Improve your network performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <OptimizationSuggestion
            title="Channel Optimization"
            description="Your WiFi channel overlaps with 3 nearby networks. Switching to channel 11 could improve performance."
            type="warning"
            actionLabel="Apply"
            onAction={() => {
              toast({
                title: "Channel optimization applied",
                description: "WiFi channel has been updated to reduce interference",
              });
            }}
          />
          
          <OptimizationSuggestion
            title="QoS Settings"
            description="Prioritize video conferencing and gaming traffic for improved responsiveness."
            type="info"
            actionLabel="Configure"
            onAction={() => {
              toast({
                title: "QoS configuration started",
                description: "Opening QoS configuration wizard",
              });
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};
