
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserX, Clock, AlertCircle, CheckCircle, User, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

// Simulated authorization requests data
const pendingRequests = [
  {
    id: "req-001",
    deviceName: "New iPhone 13",
    deviceType: "phone",
    macAddress: "00:11:22:33:44:55",
    requestTime: "Today, 10:23 AM",
    username: "sarah.smith",
    ipAddress: "192.168.1.45"
  },
  {
    id: "req-002",
    deviceName: "Unknown Android Device",
    deviceType: "phone",
    macAddress: "AA:BB:CC:DD:EE:FF",
    requestTime: "Today, 09:17 AM",
    username: "guest",
    ipAddress: "192.168.1.62"
  }
];

const recentActivities = [
  {
    id: "act-001",
    action: "approved",
    deviceName: "Tom's Laptop",
    username: "tom.wilson",
    time: "Yesterday, 3:45 PM",
    by: "admin"
  },
  {
    id: "act-002",
    action: "rejected",
    deviceName: "Unknown Device",
    username: "anonymous",
    time: "Yesterday, 11:30 AM",
    by: "admin"
  },
  {
    id: "act-003",
    action: "approved",
    deviceName: "Kitchen Tablet",
    username: "family",
    time: "May 12, 6:20 PM",
    by: "admin"
  }
];

export const AuthorizationRequests = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <UserCheck className="text-shield-accent" />
                Authorization Requests
              </CardTitle>
              <CardDescription>Manage pending network access requests</CardDescription>
            </div>
            <Badge variant="outline" className="bg-status-warning/10 text-status-warning border-status-warning/30">
              {pendingRequests.length} Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending Requests</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="settings">Auth Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="space-y-4">
              {pendingRequests.length > 0 ? (
                pendingRequests.map(request => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-full bg-status-warning/20 flex items-center justify-center text-status-warning">
                            <AlertCircle size={24} />
                          </div>
                          <div>
                            <p className="font-medium text-lg">{request.deviceName}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-1">
                              <div className="flex items-center gap-2">
                                <User size={14} className="text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{request.username}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock size={14} className="text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{request.requestTime}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">MAC: {request.macAddress}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">IP: {request.ipAddress}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 md:justify-end">
                          <Button variant="outline" size="sm" className="gap-1">
                            <UserX size={16} />
                            Reject
                          </Button>
                          <Button size="sm" className="gap-1 bg-shield hover:bg-shield-secondary">
                            <UserCheck size={16} />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <CheckCircle size={48} className="text-status-safe mb-4" />
                  <p className="text-lg font-medium">No pending requests</p>
                  <p className="text-muted-foreground">All authorization requests have been handled</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="activity">
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center",
                        activity.action === "approved"
                          ? "bg-status-safe/20 text-status-safe"
                          : "bg-status-danger/20 text-status-danger"
                      )}>
                        {activity.action === "approved" ? <UserCheck size={20} /> : <UserX size={20} />}
                      </div>
                      <div>
                        <p className="font-medium">
                          {activity.action === "approved" ? "Approved" : "Rejected"}: {activity.deviceName}
                        </p>
                        <p className="text-sm text-muted-foreground">User: {activity.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{activity.time}</p>
                      <p className="text-sm text-muted-foreground">By: {activity.by}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Authentication Mode</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-status-safe"></div>
                          <span className="font-medium">Admin Approval Required</span>
                        </div>
                        <Button variant="outline" size="sm">Change</Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        New devices require explicit approval from an administrator before gaining network access.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Auto-Approve Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Known Device Types</p>
                          <p className="text-sm text-muted-foreground">Auto-approve recognized device types</p>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Trusted MAC Addresses</p>
                          <p className="text-sm text-muted-foreground">3 addresses in whitelist</p>
                        </div>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Access Control List</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <UserPlus size={20} className="text-shield" />
                        <div>
                          <p className="font-medium">Add New User</p>
                          <p className="text-sm text-muted-foreground">Create authentication credentials for a new user</p>
                        </div>
                      </div>
                      <Button className="bg-shield hover:bg-shield-secondary">Create User</Button>
                    </div>
                    
                    <div className="border-t pt-4 mt-2">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium">Current Users</p>
                        <Badge>4 users</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-muted/40 rounded">
                          <span>admin (Administrator)</span>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-muted/40 rounded">
                          <span>john.doe (Standard User)</span>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-muted/40 rounded">
                          <span>sarah.smith (Standard User)</span>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-muted/40 rounded">
                          <span>guest (Guest)</span>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
