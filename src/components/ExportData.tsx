
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FileCsv, FilePdf, Download } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export const ExportData = () => {
  const { toast } = useToast();
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | 'json'>('csv');
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedData, setSelectedData] = useState({
    networkSpeed: true,
    deviceActivity: true,
    securityEvents: false,
    optimizations: false
  });

  const handleCheckboxChange = (field: keyof typeof selectedData) => {
    setSelectedData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleExport = () => {
    // In a real application, this would trigger an actual export
    const dataTypes = Object.entries(selectedData)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type)
      .join(", ");
    
    toast({
      title: "Export Started",
      description: `Your ${dataTypes} data is being exported in ${exportFormat.toUpperCase()} format.`,
    });
    
    // Simulate download after a delay
    setTimeout(() => {
      toast({
        title: "Export Completed",
        description: "Your data has been exported successfully.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Export Data</h1>
      
      <Tabs defaultValue="export" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="export">Export Options</TabsTrigger>
          <TabsTrigger value="history">Export History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Export Network Data</CardTitle>
              <CardDescription>Select data types and format for export</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Data to Include</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="networkSpeed" 
                        checked={selectedData.networkSpeed} 
                        onCheckedChange={() => handleCheckboxChange('networkSpeed')}
                      />
                      <Label htmlFor="networkSpeed">Network Speed Data</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="deviceActivity" 
                        checked={selectedData.deviceActivity} 
                        onCheckedChange={() => handleCheckboxChange('deviceActivity')}
                      />
                      <Label htmlFor="deviceActivity">Device Activity</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="securityEvents" 
                        checked={selectedData.securityEvents} 
                        onCheckedChange={() => handleCheckboxChange('securityEvents')}
                      />
                      <Label htmlFor="securityEvents">Security Events</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="optimizations" 
                        checked={selectedData.optimizations} 
                        onCheckedChange={() => handleCheckboxChange('optimizations')}
                      />
                      <Label htmlFor="optimizations">Network Optimizations</Label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="format">Export Format</Label>
                    <Select 
                      value={exportFormat} 
                      onValueChange={(value) => setExportFormat(value as 'csv' | 'pdf' | 'json')}
                    >
                      <SelectTrigger id="format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeRange">Time Range</Label>
                    <Select 
                      value={timeRange} 
                      onValueChange={setTimeRange}
                    >
                      <SelectTrigger id="timeRange">
                        <SelectValue placeholder="Select time range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1d">Last 24 Hours</SelectItem>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                        <SelectItem value="30d">Last 30 Days</SelectItem>
                        <SelectItem value="90d">Last 90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleExport} className="w-full md:w-auto">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Export History</CardTitle>
              <CardDescription>Your previous exports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border border-border p-4 flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-center">
                    <FileCsv className="h-8 w-8 mr-3 text-blue-500" />
                    <div>
                      <div className="font-medium">Network Speed Data</div>
                      <div className="text-sm text-muted-foreground">CSV • 245 KB • April 18, 2025</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 md:mt-0">
                    Download
                  </Button>
                </div>
                
                <div className="rounded-md border border-border p-4 flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-center">
                    <FilePdf className="h-8 w-8 mr-3 text-red-500" />
                    <div>
                      <div className="font-medium">Monthly Network Report</div>
                      <div className="text-sm text-muted-foreground">PDF • 1.2 MB • April 15, 2025</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 md:mt-0">
                    Download
                  </Button>
                </div>
                
                <div className="rounded-md border border-border p-4 flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 mr-3 text-green-500" />
                    <div>
                      <div className="font-medium">Device Activity Log</div>
                      <div className="text-sm text-muted-foreground">JSON • 320 KB • April 12, 2025</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 md:mt-0">
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
