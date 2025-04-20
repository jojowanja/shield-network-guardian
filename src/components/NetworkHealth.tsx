
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle, AlertCircle, Cpu, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NetworkHealthItem {
  name: string;
  status: "good" | "warning" | "critical";
  message: string;
}

interface NetworkHealthProps {
  items: NetworkHealthItem[];
}

export const NetworkHealth = ({ items }: NetworkHealthProps) => {
  const criticalCount = items.filter(item => item.status === "critical").length;
  const warningCount = items.filter(item => item.status === "warning").length;
  
  let overallStatus: "good" | "warning" | "critical" = "good";
  if (criticalCount > 0) {
    overallStatus = "critical";
  } else if (warningCount > 0) {
    overallStatus = "warning";
  }
  
  const getStatusColor = (status: "good" | "warning" | "critical") => {
    switch (status) {
      case "good": return "text-green-500";
      case "warning": return "text-yellow-500";
      case "critical": return "text-red-500";
      default: return "text-gray-500";
    }
  };
  
  const getStatusIcon = (status: "good" | "warning" | "critical") => {
    switch (status) {
      case "good": return <CheckCircle size={16} className="text-green-500" />;
      case "warning": return <AlertCircle size={16} className="text-yellow-500" />;
      case "critical": return <AlertCircle size={16} className="text-red-500" />;
      default: return null;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Shield className={cn("text-primary", getStatusColor(overallStatus))} />
            Network Health
          </CardTitle>
          <div className="flex items-center space-x-1">
            <div className={cn(
              "w-2 h-2 rounded-full", 
              overallStatus === "good" ? "bg-green-500" : 
              overallStatus === "warning" ? "bg-yellow-500" : "bg-red-500"
            )}></div>
            <span className={cn(
              "text-sm font-medium",
              getStatusColor(overallStatus)
            )}>
              {overallStatus === "good" ? "Healthy" : 
               overallStatus === "warning" ? "Warning" : "Issues Detected"}
            </span>
          </div>
        </div>
        <CardDescription>
          Overall status of your network system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div 
              key={index}
              className={cn(
                "flex items-center justify-between py-2 px-3 rounded-md",
                item.status === "good" ? "bg-green-50 dark:bg-green-950/30" : 
                item.status === "warning" ? "bg-yellow-50 dark:bg-yellow-950/30" : 
                "bg-red-50 dark:bg-red-950/30"
              )}
            >
              <div className="flex items-center gap-2">
                {item.status === "good" ? (
                  <Cpu size={16} className="text-green-500" />
                ) : (
                  <Wifi size={16} className={
                    item.status === "warning" ? "text-yellow-500" : "text-red-500"
                  } />
                )}
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={cn(
                  "text-xs",
                  getStatusColor(item.status)
                )}>
                  {item.message}
                </span>
                {getStatusIcon(item.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
