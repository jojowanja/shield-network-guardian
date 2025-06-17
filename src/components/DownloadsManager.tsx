
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Download, FileText, FileSpreadsheet, File, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DownloadItem {
  id: string;
  filename: string;
  type: "report" | "config" | "log";
  size: string;
  progress: number;
  status: "downloading" | "completed" | "failed";
  timestamp: Date;
}

export const DownloadsManager = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  const simulateDownload = (filename: string, type: DownloadItem["type"]) => {
    const newDownload: DownloadItem = {
      id: Date.now().toString(),
      filename,
      type,
      size: `${Math.floor(Math.random() * 5000) + 100}KB`,
      progress: 0,
      status: "downloading",
      timestamp: new Date(),
    };

    setDownloads(prev => [newDownload, ...prev]);
    toast.info(`Started downloading ${filename}`);

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloads(prev => prev.map(download => {
        if (download.id === newDownload.id) {
          const newProgress = Math.min(download.progress + Math.random() * 30, 100);
          const newStatus = newProgress >= 100 ? "completed" : "downloading";
          
          if (newStatus === "completed" && download.status === "downloading") {
            toast.success(`${filename} downloaded successfully!`);
          }
          
          return { ...download, progress: newProgress, status: newStatus };
        }
        return download;
      }));
    }, 500);

    setTimeout(() => clearInterval(interval), 4000);
  };

  const deleteDownload = (id: string) => {
    setDownloads(prev => prev.filter(download => download.id !== id));
    toast.info("Download removed");
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "report": return <FileText size={16} className="text-blue-500" />;
      case "config": return <FileSpreadsheet size={16} className="text-green-500" />;
      case "log": return <File size={16} className="text-orange-500" />;
      default: return <File size={16} className="text-gray-500" />;
    }
  };

  // Auto-generate downloads periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const sampleFiles = [
        { name: "network-report.pdf", type: "report" },
        { name: "security-log.txt", type: "log" },
        { name: "device-config.json", type: "config" },
        { name: "traffic-analysis.csv", type: "report" },
      ];
      
      const randomFile = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
      simulateDownload(randomFile.name, randomFile.type as DownloadItem["type"]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="text-shield-accent" />
          Downloads Manager
          <Badge variant="outline">{downloads.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => simulateDownload("network-report.pdf", "report")}
              className="bg-shield hover:bg-shield-secondary"
            >
              Download Report
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => simulateDownload("security-config.json", "config")}
            >
              Export Config
            </Button>
          </div>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {downloads.map((download) => (
              <div
                key={download.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card animate-fade-in"
              >
                {getFileIcon(download.type)}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{download.filename}</span>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={download.status === "completed" ? "default" : "secondary"}
                        className={
                          download.status === "completed" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : download.status === "downloading"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }
                      >
                        {download.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteDownload(download.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                  
                  {download.status === "downloading" && (
                    <Progress value={download.progress} className="h-2" />
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{download.size}</span>
                    <span>{download.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {downloads.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Download className="mx-auto mb-2 text-gray-400" size={24} />
                <p>No downloads yet</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
