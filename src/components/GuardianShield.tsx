
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, ShieldAlert, Clock, Shield, Lock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export const GuardianShield = () => {
  // Simulated data
  const securityScore = 85;
  const threatsTodayCount = 0;
  const threatsBlockedCount = 23;
  const lastScanTime = "2 hours ago";
  const securityStatus = "Protected";
  
  // Determine status color based on score
  const getStatusColor = (score: number) => {
    if (score >= 80) return "status-safe";
    if (score >= 60) return "status-warning";
    return "status-danger";
  };
  
  const statusColor = getStatusColor(securityScore);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="w-full lg:w-2/3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Guardian Shield Status</CardTitle>
                <CardDescription>Your network security at a glance</CardDescription>
              </div>
              <div className={cn("status-indicator", `text-${statusColor}`)}>
                <span className={cn("dot", `bg-${statusColor}`)}></span>
                <span className="font-medium">{securityStatus}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-8">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Security Score</span>
                  <span className={`font-bold text-${statusColor}`}>{securityScore}%</span>
                </div>
                <Progress value={securityScore} className={`h-2 bg-gray-200`} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-muted/40">
                  <div className="h-12 w-12 rounded-full bg-status-safe/20 flex items-center justify-center text-status-safe">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Threats Today</p>
                    <p className="text-2xl font-bold">{threatsTodayCount}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-muted/40">
                  <div className="h-12 w-12 rounded-full bg-status-safe/20 flex items-center justify-center text-status-safe">
                    <Shield size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Threats Blocked</p>
                    <p className="text-2xl font-bold">{threatsBlockedCount}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-muted/40">
                  <div className="h-12 w-12 rounded-full bg-shield-accent/20 flex items-center justify-center text-shield-accent">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Scan</p>
                    <p className="text-lg font-bold">{lastScanTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full lg:w-1/3">
          <CardHeader>
            <CardTitle>Security Features</CardTitle>
            <CardDescription>Active protection systems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full bg-status-safe/20 flex items-center justify-center text-status-safe shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-medium">Firewall Protection</p>
                <p className="text-sm text-muted-foreground">Active and monitoring all connections</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full bg-status-safe/20 flex items-center justify-center text-status-safe shrink-0">
                <Lock size={20} />
              </div>
              <div>
                <p className="font-medium">Intrusion Prevention</p>
                <p className="text-sm text-muted-foreground">Blocking suspicious activities</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full bg-status-warning/20 flex items-center justify-center text-status-warning shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <p className="font-medium">Vulnerability Scanner</p>
                <p className="text-sm text-muted-foreground">Last scan found 2 minor issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border-l-4 border-status-safe bg-status-safe/10 rounded">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="text-status-safe" />
                <div>
                  <p className="font-medium">Password change detected</p>
                  <p className="text-sm text-muted-foreground">Admin password was updated</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">Today, 10:45 AM</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border-l-4 border-status-warning bg-status-warning/10 rounded">
              <div className="flex items-center space-x-3">
                <ShieldAlert className="text-status-warning" />
                <div>
                  <p className="font-medium">Multiple login attempts</p>
                  <p className="text-sm text-muted-foreground">3 failed attempts from IP 192.168.1.45</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">Yesterday, 8:32 PM</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border-l-4 border-status-safe bg-status-safe/10 rounded">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="text-status-safe" />
                <div>
                  <p className="font-medium">System update completed</p>
                  <p className="text-sm text-muted-foreground">Security definitions updated to latest version</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">Yesterday, 3:15 PM</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
