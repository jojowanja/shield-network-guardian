
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Clock, Wifi, WifiOff } from "lucide-react";

interface GuestSession {
  id: string;
  name: string;
  reason: string;
  duration: number;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  deviceCount: number;
}

export const InteractiveGuestAccess = () => {
  const [guestName, setGuestName] = useState("");
  const [guestReason, setGuestReason] = useState("");
  const [duration, setDuration] = useState("60");
  const [guestSessions, setGuestSessions] = useState<GuestSession[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      reason: "Business meeting",
      duration: 120,
      startTime: new Date(Date.now() - 45 * 60000), // 45 minutes ago
      isActive: true,
      deviceCount: 2
    },
    {
      id: "2",
      name: "Mike Chen",
      reason: "Home visit",
      duration: 60,
      startTime: new Date(Date.now() - 3 * 3600000), // 3 hours ago
      endTime: new Date(Date.now() - 2 * 3600000), // ended 2 hours ago
      isActive: false,
      deviceCount: 1
    }
  ]);
  const { toast } = useToast();

  const addGuest = () => {
    if (!guestName.trim() || !guestReason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in guest name and reason",
        variant: "destructive"
      });
      return;
    }

    const newSession: GuestSession = {
      id: Date.now().toString(),
      name: guestName.trim(),
      reason: guestReason.trim(),
      duration: parseInt(duration),
      startTime: new Date(),
      isActive: true,
      deviceCount: 0
    };

    setGuestSessions(prev => [...prev, newSession]);
    
    toast({
      title: "Guest Added Successfully",
      description: `${guestName} has been granted ${duration} minutes of access`,
    });

    // Reset form
    setGuestName("");
    setGuestReason("");
    setDuration("60");
  };

  const endSession = (sessionId: string) => {
    setGuestSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, isActive: false, endTime: new Date() }
        : session
    ));

    const session = guestSessions.find(s => s.id === sessionId);
    toast({
      title: "Session Ended",
      description: `${session?.name}'s access has been terminated`,
    });
  };

  const extendSession = (sessionId: string, additionalMinutes: number) => {
    setGuestSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, duration: session.duration + additionalMinutes }
        : session
    ));

    const session = guestSessions.find(s => s.id === sessionId);
    toast({
      title: "Session Extended",
      description: `${session?.name}'s access extended by ${additionalMinutes} minutes`,
    });
  };

  const getRemainingTime = (session: GuestSession) => {
    if (!session.isActive) return "Ended";
    
    const elapsed = Date.now() - session.startTime.getTime();
    const remaining = (session.duration * 60000) - elapsed;
    
    if (remaining <= 0) return "Expired";
    
    const minutes = Math.floor(remaining / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getSessionStatus = (session: GuestSession) => {
    if (!session.isActive) {
      return <Badge variant="outline" className="bg-gray-100">Ended</Badge>;
    }
    
    const remaining = getRemainingTime(session);
    if (remaining === "Expired") {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    return <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>;
  };

  const activeSessions = guestSessions.filter(s => s.isActive).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="text-blue-500" />
            Guest Access Panel
          </CardTitle>
          <CardDescription>
            Manage temporary network access for visitors ({activeSessions} active sessions)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="guest-name">Guest Name</Label>
              <Input
                id="guest-name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Enter guest name"
              />
            </div>
            
            <div>
              <Label htmlFor="guest-reason">Reason for Access</Label>
              <Input
                id="guest-reason"
                value={guestReason}
                onChange={(e) => setGuestReason(e.target.value)}
                placeholder="e.g., Business meeting"
              />
            </div>
            
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                  <SelectItem value="480">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={addGuest} className="w-full md:w-auto">
            <UserPlus className="mr-2" size={16} />
            Add Guest Access
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Guest Sessions</CardTitle>
          <CardDescription>Monitor and manage current guest access</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest Name</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time Remaining</TableHead>
                <TableHead>Devices</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guestSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.name}</TableCell>
                  <TableCell>{session.reason}</TableCell>
                  <TableCell>{getSessionStatus(session)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {getRemainingTime(session)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Wifi size={14} />
                      {session.deviceCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {session.isActive ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => extendSession(session.id, 30)}
                          >
                            +30m
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => endSession(session.id)}
                          >
                            <WifiOff size={14} className="mr-1" />
                            End
                          </Button>
                        </>
                      ) : (
                        <Badge variant="outline">Session Ended</Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {guestSessions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No guest sessions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
