
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileExport } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample data
const weeklyData = [
  { day: 'Mon', download: 85, upload: 25, devices: 8 },
  { day: 'Tue', download: 78, upload: 22, devices: 7 },
  { day: 'Wed', download: 92, upload: 28, devices: 9 },
  { day: 'Thu', download: 88, upload: 23, devices: 8 },
  { day: 'Fri', download: 95, upload: 30, devices: 10 },
  { day: 'Sat', download: 110, upload: 35, devices: 12 },
  { day: 'Sun', download: 102, upload: 32, devices: 11 },
];

const monthlyData = [
  { week: 'Week 1', download: 92, upload: 28, stability: 95 },
  { week: 'Week 2', download: 88, upload: 26, stability: 93 },
  { week: 'Week 3', download: 95, upload: 30, stability: 97 },
  { week: 'Week 4', download: 105, upload: 32, stability: 96 },
];

const deviceUsageData = [
  { name: 'Laptop', value: 35 },
  { name: 'Smartphone', value: 30 },
  { name: 'Smart TV', value: 20 },
  { name: 'Tablet', value: 10 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

export const EnhancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('weekly');
  const { toast } = useToast();

  const handleExport = (format: 'csv' | 'pdf') => {
    // In a real application, you would implement actual export functionality
    toast({
      title: `Export to ${format.toUpperCase()} initiated`,
      description: `Your data is being prepared for download in ${format.toUpperCase()} format.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Network Analytics</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <FileExport className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <FileExport className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="speed" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="speed">Speed</TabsTrigger>
          <TabsTrigger value="stability">Stability</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>
        <TabsContent value="speed">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">Network Speed Over Time</CardTitle>
                  <CardDescription>Download and Upload speeds</CardDescription>
                </div>
                <div className="mt-3 sm:mt-0 flex space-x-2">
                  <Button 
                    variant={timeRange === 'weekly' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setTimeRange('weekly')}
                  >
                    Weekly
                  </Button>
                  <Button 
                    variant={timeRange === 'monthly' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setTimeRange('monthly')}
                  >
                    Monthly
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={timeRange === 'weekly' ? weeklyData : monthlyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={timeRange === 'weekly' ? 'day' : 'week'} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="download" stroke="#8884d8" fill="#8884d8" name="Download (Mbps)" />
                  <Area type="monotone" dataKey="upload" stroke="#82ca9d" fill="#82ca9d" name="Upload (Mbps)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stability">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Network Stability</CardTitle>
              <CardDescription>Stability percentage over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={monthlyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="stability" stroke="#8884d8" name="Stability (%)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="devices">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Connected Devices</CardTitle>
                <CardDescription>Number of devices over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={weeklyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="devices" fill="#8884d8" name="Devices" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Device Usage Distribution</CardTitle>
                <CardDescription>Breakdown by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceUsageData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {deviceUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
