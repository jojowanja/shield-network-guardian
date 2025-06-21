
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wifi, Zap, Activity, Loader2 } from "lucide-react";

interface NetworkData {
  time: string;
  download: number;
  upload: number;
  ping: number;
}

export const NetworkStatusChecker = () => {
  const [isTestingSpeed, setIsTestingSpeed] = useState(false);
  const [currentStats, setCurrentStats] = useState({
    download: 125.4,
    upload: 23.8,
    ping: 12,
    connectionStrength: 85
  });
  const [networkHistory, setNetworkHistory] = useState<NetworkData[]>([
    { time: "10:00", download: 120, upload: 20, ping: 15 },
    { time: "10:05", download: 118, upload: 22, ping: 13 },
    { time: "10:10", download: 125, upload: 24, ping: 12 },
    { time: "10:15", download: 122, upload: 21, ping: 14 },
    { time: "10:20", download: 127, upload: 25, ping: 11 }
  ]);
  const { toast } = useToast();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newDownload = 100 + Math.random() * 50;
      const newUpload = 15 + Math.random() * 15;
      const newPing = 8 + Math.random() * 10;
      const newStrength = 70 + Math.random() * 30;
      
      setCurrentStats({
        download: newDownload,
        upload: newUpload,
        ping: newPing,
        connectionStrength: newStrength
      });

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setNetworkHistory(prev => {
        const newHistory = [...prev, {
          time: timeStr,
          download: newDownload,
          upload: newUpload,
          ping: newPing
        }];
        return newHistory.slice(-10); // Keep last 10 entries
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const runSpeedTest = async () => {
    setIsTestingSpeed(true);
    
    // Simulate speed test progression
    const testSteps = [
      { message: "Initializing speed test...", duration: 1000 },
      { message: "Testing download speed...", duration: 2000 },
      { message: "Testing upload speed...", duration: 1500 },
      { message: "Measuring latency...", duration: 1000 },
      { message: "Finalizing results...", duration: 500 }
    ];

    for (const step of testSteps) {
      toast({
        title: "Speed Test",
        description: step.message,
        duration: step.duration
      });
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }

    // Generate test results
    const testResults = {
      download: 100 + Math.random() * 80,
      upload: 15 + Math.random() * 25,
      ping: 5 + Math.random() * 20,
      connectionStrength: 75 + Math.random() * 25
    };

    setCurrentStats(testResults);
    setIsTestingSpeed(false);
    
    toast({
      title: "Speed Test Complete!",
      description: `Download: ${testResults.download.toFixed(1)} Mbps, Upload: ${testResults.upload.toFixed(1)} Mbps, Ping: ${testResults.ping.toFixed(0)} ms`,
      duration: 5000
    });
  };

  const getConnectionQuality = (strength: number) => {
    if (strength >= 80) return { label: "Excellent", color: "text-green-600" };
    if (strength >= 60) return { label: "Good", color: "text-blue-600" };
    if (strength >= 40) return { label: "Fair", color: "text-yellow-600" };
    return { label: "Poor", color: "text-red-600" };
  };

  const quality = getConnectionQuality(currentStats.connectionStrength);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="text-green-500" />
            Network Status Checker
          </CardTitle>
          <CardDescription>Real-time network performance monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600">Download Speed</div>
              <div className="text-2xl font-bold text-blue-700">
                {currentStats.download.toFixed(1)} Mbps
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600">Upload Speed</div>
              <div className="text-2xl font-bold text-green-700">
                {currentStats.upload.toFixed(1)} Mbps
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600">Ping</div>
              <div className="text-2xl font-bold text-purple-700">
                {currentStats.ping.toFixed(0)} ms
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Connection Strength</div>
              <div className={`text-lg font-semibold ${quality.color}`}>
                {quality.label} ({currentStats.connectionStrength.toFixed(0)}%)
              </div>
              <Progress value={currentStats.connectionStrength} className="mt-2" />
            </div>
          </div>
          
          <Button 
            onClick={runSpeedTest} 
            disabled={isTestingSpeed}
            className="w-full md:w-auto"
          >
            {isTestingSpeed ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Testing Connection...
              </>
            ) : (
              <>
                <Zap className="mr-2" size={16} />
                Run Speed Test
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Real-time Network Performance</CardTitle>
          <CardDescription>Live speed monitoring over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={networkHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="download" stroke="#3b82f6" name="Download (Mbps)" />
                <Line type="monotone" dataKey="upload" stroke="#10b981" name="Upload (Mbps)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
