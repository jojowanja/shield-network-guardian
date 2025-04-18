
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, Calendar, Download, Upload, Clock, Activity, 
  Smartphone, Laptop, Tv, Info, Filter, ArrowUpRight
} from "lucide-react";
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// Simulated bandwidth data
const dailyData = [
  { time: '12 AM', download: 1.2, upload: 0.4 },
  { time: '3 AM', download: 0.5, upload: 0.2 },
  { time: '6 AM', download: 0.7, upload: 0.3 },
  { time: '9 AM', download: 3.5, upload: 1.5 },
  { time: '12 PM', download: 5.2, upload: 2.1 },
  { time: '3 PM', download: 4.8, upload: 2.0 },
  { time: '6 PM', download: 7.5, upload: 3.2 },
  { time: '9 PM', download: 6.2, upload: 2.5 },
  { time: '11 PM', download: 3.8, upload: 1.7 }
];

const weeklyData = [
  { day: 'Mon', download: 24, upload: 8 },
  { day: 'Tue', download: 30, upload: 12 },
  { day: 'Wed', download: 22, upload: 10 },
  { day: 'Thu', download: 35, upload: 15 },
  { day: 'Fri', download: 40, upload: 18 },
  { day: 'Sat', download: 55, upload: 22 },
  { day: 'Sun', download: 48, upload: 20 }
];

const monthlyData = [
  { week: 'Week 1', download: 182, upload: 65 },
  { week: 'Week 2', download: 230, upload: 78 },
  { week: 'Week 3', download: 245, upload: 82 },
  { week: 'Week 4', download: 198, upload: 70 }
];

// Simulated device usage data
const deviceUsage = [
  { name: 'Living Room TV', data: 42.5 },
  { name: 'John\'s MacBook', data: 25.3 },
  { name: 'Sarah\'s iPhone', data: 18.7 },
  { name: 'Kitchen iPad', data: 9.2 },
  { name: 'Others', data: 4.3 }
];

// Simulated traffic types data
const trafficTypes = [
  { name: 'Streaming', value: 45 },
  { name: 'Web Browsing', value: 25 },
  { name: 'Downloads', value: 15 },
  { name: 'Gaming', value: 10 },
  { name: 'Other', value: 5 }
];

export const NetworkOverview = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="text-shield-accent" />
                Network Traffic Overview
              </CardTitle>
              <CardDescription>Monitor your network bandwidth usage</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter size={16} />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Calendar size={16} />
                Date Range
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-shield/20 flex items-center justify-center text-shield">
                      <Download size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Download</p>
                      <p className="text-2xl font-bold">485.2 GB</p>
                    </div>
                  </div>
                  <ArrowUpRight className="text-status-safe" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-shield/20 flex items-center justify-center text-shield">
                      <Upload size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Upload</p>
                      <p className="text-2xl font-bold">175.8 GB</p>
                    </div>
                  </div>
                  <ArrowUpRight className="text-status-safe" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-shield/20 flex items-center justify-center text-shield">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Peak Usage Time</p>
                      <p className="text-2xl font-bold">6:00 - 9:00 PM</p>
                    </div>
                  </div>
                  <Info size={16} className="text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="daily">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData}>
                  <defs>
                    <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00a5cf" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00a5cf" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0c3b5c" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0c3b5c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="download" 
                    name="Download (GB)"
                    stroke="#00a5cf" 
                    fillOpacity={1} 
                    fill="url(#colorDownload)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="upload" 
                    name="Upload (GB)"
                    stroke="#0c3b5c" 
                    fillOpacity={1}
                    fill="url(#colorUpload)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="weekly" className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="download" name="Download (GB)" fill="#00a5cf" />
                  <Bar dataKey="upload" name="Upload (GB)" fill="#0c3b5c" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="monthly" className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="download" 
                    name="Download (GB)"
                    stroke="#00a5cf" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="upload" 
                    name="Upload (GB)"
                    stroke="#0c3b5c" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="text-shield" />
              Device Usage
            </CardTitle>
            <CardDescription>Data consumption by device</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={deviceUsage}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" unit="GB" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="data" name="Data Used (GB)" fill="#00a5cf" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="text-shield" />
              Traffic Types
            </CardTitle>
            <CardDescription>Network usage by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficTypes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis unit="%" />
                  <Tooltip />
                  <Bar dataKey="value" name="Traffic %" fill="#0c3b5c" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Connected Device Types</CardTitle>
          <CardDescription>Current network device distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center p-6 border rounded-lg">
              <div className="h-14 w-14 rounded-full bg-shield/10 flex items-center justify-center text-shield mb-4">
                <Smartphone size={28} />
              </div>
              <h3 className="text-xl font-bold">5</h3>
              <p className="text-muted-foreground">Mobile Phones</p>
            </div>
            
            <div className="flex flex-col items-center p-6 border rounded-lg">
              <div className="h-14 w-14 rounded-full bg-shield/10 flex items-center justify-center text-shield mb-4">
                <Laptop size={28} />
              </div>
              <h3 className="text-xl font-bold">3</h3>
              <p className="text-muted-foreground">Computers</p>
            </div>
            
            <div className="flex flex-col items-center p-6 border rounded-lg">
              <div className="h-14 w-14 rounded-full bg-shield/10 flex items-center justify-center text-shield mb-4">
                <Tv size={28} />
              </div>
              <h3 className="text-xl font-bold">2</h3>
              <p className="text-muted-foreground">Smart TVs</p>
            </div>
            
            <div className="flex flex-col items-center p-6 border rounded-lg">
              <div className="h-14 w-14 rounded-full bg-shield/10 flex items-center justify-center text-shield mb-4">
                <Activity size={28} />
              </div>
              <h3 className="text-xl font-bold">4</h3>
              <p className="text-muted-foreground">Other Devices</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
