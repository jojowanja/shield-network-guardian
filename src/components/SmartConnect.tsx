
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RaspberryPiConnect } from "@/components/RaspberryPiConnect";
import { NetworkStatusChecker } from "@/components/NetworkStatusChecker";
import { useToast } from "@/hooks/use-toast";
import { Wifi, WifiOff, Activity, Zap, CheckCircle, AlertCircle } from "lucide-react";

export const SmartConnect = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("idle");
  const { toast } = useToast();

  const handleQuickScan = async () => {
    setIsScanning(true);
    setConnectionStatus("scanning");
    
    // Simulate network scanning
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setConnectionStatus("completed");
    setIsScanning(false);
    
    toast({
      title: "Network Scan Complete",
      description: "Found 12 devices on your network",
    });
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "scanning":
        return <Activity className="animate-spin text-blue-500" size={20} />;
      case "completed":
        return <CheckCircle className="text-green-500" size={20} />;
      default:
        return <Wifi className="text-gray-500" size={20} />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "scanning":
        return "Scanning network...";
      case "completed":
        return "Network scan completed";
      default:
        return "Ready to connect";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Smart Connect</h1>
        <p className="text-muted-foreground">
          Connect and monitor your network devices in real-time
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              Network Connection Status
            </CardTitle>
            <CardDescription>
              Monitor your network connectivity and perform quick diagnostics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={connectionStatus === "completed" ? "default" : "secondary"}>
                {getStatusText()}
              </Badge>
            </div>
            
            {isScanning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Scanning Progress</span>
                  <span>Analyzing network...</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">12</div>
                <div className="text-xs text-green-600 dark:text-green-400">Active Devices</div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">98%</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">Network Health</div>
              </div>
            </div>
            
            <Button 
              onClick={handleQuickScan} 
              disabled={isScanning}
              className="w-full"
            >
              {isScanning ? (
                <>
                  <Activity className="animate-spin mr-2" size={16} />
                  Scanning Network...
                </>
              ) : (
                <>
                  <Zap className="mr-2" size={16} />
                  Quick Network Scan
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <RaspberryPiConnect />
      </div>

      <NetworkStatusChecker />
    </div>
  );
};
