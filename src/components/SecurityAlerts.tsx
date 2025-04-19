
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchSecurityEvents, resolveSecurityEvent } from "@/services/networkService";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle, Info, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SecurityEvent {
  id: string;
  deviceId: string | null;
  eventType: "new_device" | "suspicious_activity" | "network_change" | "other";
  severity: "low" | "medium" | "high";
  description: string;
  timestamp: string;
  resolved: boolean;
  userId: string;
}

export const SecurityAlerts = () => {
  const [showResolved, setShowResolved] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch security events
  const { data: securityEvents, isLoading } = useQuery({
    queryKey: ["securityEvents", showResolved, user?.id],
    queryFn: () => fetchSecurityEvents(showResolved),
    enabled: !!user,
  });

  // Mutation for resolving security events
  const resolveMutation = useMutation({
    mutationFn: resolveSecurityEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["securityEvents"] });
    },
  });

  // Handle resolving an event
  const handleResolve = (id: string) => {
    resolveMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Alert resolved",
          description: "The security alert has been marked as resolved",
        });
      },
      onError: (error) => {
        toast({
          title: "Failed to resolve alert",
          description: error instanceof Error ? error.message : "An error occurred",
          variant: "destructive",
        });
      },
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">Medium</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get event icon
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "new_device":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "suspicious_activity":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "network_change":
        return <ShieldAlert className="h-5 w-5 text-purple-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">Security Alerts</CardTitle>
            <CardDescription>
              {isLoading ? "Loading alerts..." : 
                securityEvents?.length 
                  ? `${securityEvents.length} ${showResolved ? "resolved" : "active"} alerts` 
                  : "No alerts found"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="whitespace-nowrap"
              onClick={() => setShowResolved(!showResolved)}
            >
              {showResolved ? "Show Active Alerts" : "Show Resolved"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-shield border-t-transparent" />
          </div>
        ) : securityEvents && securityEvents.length > 0 ? (
          <div className="space-y-4">
            {securityEvents.map(event => (
              <div 
                key={event.id} 
                className={`border rounded-lg p-4 ${
                  event.resolved ? "bg-gray-50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getEventIcon(event.eventType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{event.description}</p>
                        {getSeverityBadge(event.severity)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(event.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  {!event.resolved && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex items-center gap-1"
                      onClick={() => handleResolve(event.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Resolve</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <ShieldAlert className="mx-auto h-10 w-10 text-status-safe mb-3" />
            <p className="font-medium">No {showResolved ? "resolved" : "active"} security alerts</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your network is currently secure
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
