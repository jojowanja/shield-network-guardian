
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Laptop, Smartphone, Tv, Tablet, Search, MoreVertical, 
  WifiOff, Clock, ArrowDownToLine, ArrowUpFromLine, Ban
} from "lucide-react";

// Simulated device data
const devices = [
  {
    id: "dev-001",
    name: "John's MacBook Pro",
    type: "laptop",
    ip: "192.168.1.5",
    mac: "A1:B2:C3:D4:E5:F6",
    status: "online",
    connected: "5h 23m",
    download: 1.8,
    upload: 0.4,
    priority: "high"
  },
  {
    id: "dev-002",
    name: "Living Room TV",
    type: "tv",
    ip: "192.168.1.10",
    mac: "G7:H8:I9:J0:K1:L2",
    status: "online",
    connected: "2d 7h 45m",
    download: 8.5,
    upload: 0.1,
    priority: "normal"
  },
  {
    id: "dev-003",
    name: "Sarah's iPhone",
    type: "phone",
    ip: "192.168.1.15",
    mac: "M3:N4:O5:P6:Q7:R8",
    status: "online",
    connected: "45m",
    download: 2.3,
    upload: 0.7,
    priority: "normal"
  },
  {
    id: "dev-004",
    name: "Home Office Printer",
    type: "other",
    ip: "192.168.1.20",
    mac: "S9:T0:U1:V2:W3:X4",
    status: "offline",
    connected: "-",
    download: 0,
    upload: 0,
    priority: "low"
  },
  {
    id: "dev-005",
    name: "Kitchen iPad",
    type: "tablet",
    ip: "192.168.1.25",
    mac: "Y5:Z6:A7:B8:C9:D0",
    status: "online",
    connected: "3h 12m",
    download: 0.7,
    upload: 0.2,
    priority: "normal"
  }
];

// Function to get device icon
const getDeviceIcon = (type: string) => {
  switch (type) {
    case "laptop": return <Laptop size={18} />;
    case "phone": return <Smartphone size={18} />;
    case "tv": return <Tv size={18} />;
    case "tablet": return <Tablet size={18} />;
    default: return <Laptop size={18} />;
  }
};

// Function to get status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case "online": 
      return <Badge variant="outline" className="bg-status-safe/10 text-status-safe border-status-safe/30">Online</Badge>;
    case "offline": 
      return <Badge variant="outline" className="bg-status-inactive/10 text-status-inactive border-status-inactive/30">Offline</Badge>;
    default: 
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export const DeviceManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [groupByType, setGroupByType] = useState(false);
  
  // Filter devices based on search term
  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    device.ip.includes(searchTerm)
  );
  
  // Group devices by type if enabled
  const devicesByType = filteredDevices.reduce((acc, device) => {
    const type = device.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(device);
    return acc;
  }, {} as Record<string, typeof devices>);
  
  const deviceTypes = Object.keys(devicesByType);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Device Management</CardTitle>
              <CardDescription>View and manage connected devices</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input 
                  placeholder="Search devices..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-[250px]"
                />
              </div>
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                Add Device
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all-devices">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <TabsList className="mb-4 md:mb-0">
                <TabsTrigger value="all-devices">All Devices</TabsTrigger>
                <TabsTrigger value="online">Online</TabsTrigger>
                <TabsTrigger value="offline">Offline</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <span className="text-sm">Group by Type</span>
                <Switch 
                  checked={groupByType} 
                  onCheckedChange={setGroupByType} 
                />
              </div>
            </div>
            
            <TabsContent value="all-devices">
              {groupByType ? (
                <div className="space-y-6">
                  {deviceTypes.map(type => (
                    <div key={type}>
                      <h3 className="capitalize text-lg font-medium mb-3 flex items-center gap-2">
                        {getDeviceIcon(type)}
                        {type}s 
                        <Badge variant="outline" className="ml-2">{devicesByType[type].length}</Badge>
                      </h3>
                      <DeviceTable devices={devicesByType[type]} />
                    </div>
                  ))}
                </div>
              ) : (
                <DeviceTable devices={filteredDevices} />
              )}
            </TabsContent>
            
            <TabsContent value="online">
              <DeviceTable devices={filteredDevices.filter(d => d.status === "online")} />
            </TabsContent>
            
            <TabsContent value="offline">
              <DeviceTable devices={filteredDevices.filter(d => d.status === "offline")} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Device Policies</CardTitle>
          <CardDescription>Manage network access and restrictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Clock size={20} className="text-shield mt-1" />
                    <div>
                      <p className="font-medium">Scheduled Access</p>
                      <p className="text-sm text-muted-foreground">Limit device access during specific times</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <ArrowDownToLine size={20} className="text-shield mt-1" />
                    <div>
                      <p className="font-medium">Bandwidth Limits</p>
                      <p className="text-sm text-muted-foreground">Set download/upload limits per device</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <WifiOff size={20} className="text-shield mt-1" />
                    <div>
                      <p className="font-medium">Pause Internet</p>
                      <p className="text-sm text-muted-foreground">Temporarily disable internet for selected devices</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Ban size={20} className="text-shield mt-1" />
                    <div>
                      <p className="font-medium">Content Filtering</p>
                      <p className="text-sm text-muted-foreground">Block inappropriate websites and content</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Device table component
const DeviceTable = ({ devices }: { devices: typeof devices }) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Device</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Connected</TableHead>
            <TableHead>Traffic</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.length > 0 ? (
            devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-shield/10 flex items-center justify-center text-shield">
                      {getDeviceIcon(device.type)}
                    </div>
                    <div>
                      <p className="font-medium">{device.name}</p>
                      <p className="text-xs text-muted-foreground">{device.mac}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{device.ip}</TableCell>
                <TableCell>{getStatusBadge(device.status)}</TableCell>
                <TableCell>{device.connected}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <ArrowDownToLine size={14} className="text-shield-accent" />
                      <span>{device.download} MB/s</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <ArrowUpFromLine size={14} className="text-shield" />
                      <span>{device.upload} MB/s</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Device</DropdownMenuItem>
                      <DropdownMenuItem>Set Priority</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Block Device</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <p className="text-muted-foreground">No devices found</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
