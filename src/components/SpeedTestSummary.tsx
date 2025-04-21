
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Wifi, Zap } from "lucide-react";

interface SpeedTestSummaryProps {
  download: number;
  upload: number;
  ping: number;
  lastUpdate: Date;
}

export const SpeedTestSummary: React.FC<SpeedTestSummaryProps> = ({
  download,
  upload,
  ping,
  lastUpdate,
}) => (
  <Card className="mb-4">
    <CardContent className="py-4">
      <div className="flex items-center gap-3 mb-2">
        <Zap className="text-shield-accent" size={20} />
        <span className="font-semibold">Latest Speed Test</span>
        <span className="text-xs text-muted-foreground ml-auto">{lastUpdate.toLocaleTimeString()}</span>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center mt-2">
        <div>
          <div className="font-bold text-lg">{download.toFixed(1)} Mbps</div>
          <div className="text-xs text-muted-foreground">Download</div>
        </div>
        <div>
          <div className="font-bold text-lg">{upload.toFixed(1)} Mbps</div>
          <div className="text-xs text-muted-foreground">Upload</div>
        </div>
        <div>
          <div className="font-bold text-lg">{ping.toFixed(0)} ms</div>
          <div className="text-xs text-muted-foreground">Ping</div>
        </div>
      </div>
    </CardContent>
  </Card>
);
