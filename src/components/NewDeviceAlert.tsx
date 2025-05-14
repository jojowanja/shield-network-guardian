
import { useState } from "react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel,
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, DeviceTablet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateDevice } from "@/services/networkService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface NewDeviceAlertProps {
  device: {
    id: string;
    mac: string;
    ip: string;
    hostname?: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewDeviceAlert = ({ device, open, onOpenChange }: NewDeviceAlertProps) => {
  const [deviceName, setDeviceName] = useState(device.hostname || "");
  const [owner, setOwner] = useState("Me");
  const [isGuest, setIsGuest] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (data: { id: string, name: string, owner: string, isGuest: boolean }) => 
      updateDevice(data.id, { 
        name: data.name, 
        owner: data.owner,
        isGuest: data.isGuest 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['securityEvents'] });
      toast({
        title: "Device saved",
        description: "The device has been added to your network",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save device information",
        variant: "destructive",
      });
    }
  });
  
  const handleSave = () => {
    mutation.mutate({
      id: device.id,
      name: deviceName || `Device (${device.mac.slice(-5)})`,
      owner,
      isGuest
    });
  };
  
  const handleBlock = () => {
    // This would trigger blocking functionality
    toast({
      title: "Device blocked",
      description: "The unknown device has been blocked from your network",
    });
    onOpenChange(false);
  };
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <DeviceTablet className="h-6 w-6 text-amber-600" />
          </div>
          <AlertDialogTitle>New Device Detected</AlertDialogTitle>
          <AlertDialogDescription>
            An unknown device has connected to your network. Please identify this device or block it if you don't recognize it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="device-info">Device Information</Label>
            <div className="px-4 py-3 rounded-md bg-muted text-sm">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <span className="text-muted-foreground">MAC Address:</span>
                </div>
                <div>{device.mac}</div>
                <div>
                  <span className="text-muted-foreground">IP Address:</span>
                </div>
                <div>{device.ip}</div>
                {device.hostname && (
                  <>
                    <div>
                      <span className="text-muted-foreground">Hostname:</span>
                    </div>
                    <div>{device.hostname}</div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="device-name">Device Name</Label>
            <Input
              id="device-name"
              placeholder="Enter a friendly name"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="owner">Owner</Label>
            <Input
              id="owner"
              placeholder="Who owns this device?"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="guest-device"
              checked={isGuest}
              onChange={(e) => setIsGuest(e.target.checked)}
              className="form-checkbox h-4 w-4"
            />
            <Label htmlFor="guest-device" className="cursor-pointer">
              This is a guest device
            </Label>
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction onClick={handleBlock} className="bg-destructive hover:bg-destructive/90">
            Block Device
          </AlertDialogAction>
          <AlertDialogAction onClick={handleSave} className="bg-primary">
            <Shield className="mr-2 h-4 w-4" />
            Save Device
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
