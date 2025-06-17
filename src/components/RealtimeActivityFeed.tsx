
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Shield, Wifi, Download, Upload } from "lucide-react";

interface ActivityEvent {
  id: string;
  timestamp: Date;
  type: "security" | "network" | "download" | "upload";
  message: string;
  status: "success" | "warning" | "info";
}

export const RealtimeActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    // Simulate real-time activity events
    const generateActivity = () => {
      const events = [
        { type: "security", message: "Firewall rules updated", status: "success" },
        { type: "network", message: "Device connected: iPhone 13", status: "info" },
        { type: "download", message: "Network report downloaded", status: "success" },
        { type: "security", message: "Suspicious activity blocked", status: "warning" },
        { type: "upload", message: "Configuration backed up", status: "success" },
        { type: "network", message: "WiFi optimization completed", status: "success" },
      ];

      const randomEvent = events[Math.floor(Math.random() * events.length)];
      const newActivity: ActivityEvent = {
        id: Date.now().toString(),
        timestamp: new Date(),
        type: randomEvent.type as ActivityEvent["type"],
        message: randomEvent.message,
        status: randomEvent.status as ActivityEvent["status"],
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    };

    // Generate initial activities
    generateActivity();

    // Set up interval for new activities
    const interval = setInterval(generateActivity, 5000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "security": return <Shield size={16} className="text-red-500" />;
      case "network": return <Wifi size={16} className="text-blue-500" />;
      case "download": return <Download size={16} className="text-green-500" />;
      case "upload": return <Upload size={16} className="text-purple-500" />;
      default: return <Activity size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "warning": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "info": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="text-shield-accent" />
          Real-time Activity
          <Badge variant="outline" className="ml-auto animate-pulse">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-muted/40 animate-fade-in"
              >
                {getIcon(activity.type)}
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(activity.status)} variant="secondary">
                      {activity.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {activity.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
