
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRaspberryPi } from "@/hooks/useRaspberryPi";
import { Wifi, WifiOff } from "lucide-react";

export const RaspberryPiConnect = () => {
  const [ipAddress, setIpAddress] = useState("");
  const { status, connectToDevice, disconnectDevice } = useRaspberryPi();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Raspberry Pi Connection</CardTitle>
        <CardDescription>
          Connect to your Raspberry Pi device for real-time network monitoring
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!status.connected ? (
          <div className="space-y-4">
            <Input
              placeholder="Enter Raspberry Pi IP address"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            />
            <Button 
              onClick={() => connectToDevice(ipAddress)}
              className="w-full"
              disabled={!ipAddress}
            >
              <Wifi className="mr-2 h-4 w-4" />
              Connect
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <div>
                <p className="font-medium text-green-700 dark:text-green-300">Connected</p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {status.ipAddress}
                </p>
                <p className="text-xs text-green-500 dark:text-green-500">
                  Latency: {status.latency?.toFixed(1)}ms
                </p>
              </div>
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <Button 
              variant="destructive" 
              onClick={disconnectDevice}
              className="w-full"
            >
              <WifiOff className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
