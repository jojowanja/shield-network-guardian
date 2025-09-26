
import { useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const networkEvents = [
  { 
    message: "New device connected: iPhone 13 Pro", 
    type: "info", 
    delay: 5000,
    description: "Device joined your network" 
  },
  { 
    message: "Security scan completed", 
    type: "success", 
    delay: 8000,
    description: "No threats detected" 
  },
  { 
    message: "Bandwidth optimization active", 
    type: "info", 
    delay: 12000,
    description: "Network performance improved by 15%" 
  },
  { 
    message: "Guest device disconnected", 
    type: "warning", 
    delay: 15000,
    description: "Samsung Galaxy left the network" 
  },
  { 
    message: "Firmware update available", 
    type: "info", 
    delay: 18000,
    description: "Router firmware v2.1.4 ready to install" 
  },
  { 
    message: "Suspicious activity detected", 
    type: "warning", 
    delay: 22000,
    description: "Multiple failed login attempts from unknown device" 
  },
  { 
    message: "Network backup completed", 
    type: "success", 
    delay: 25000,
    description: "All settings and configurations saved" 
  }
];

export const useRealtimeToasts = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log("Initializing real-time notifications for user:", user.email);

      // Show initial welcome toast
      const welcomeTimeout = setTimeout(() => {
        toast.success("Shield Network Guardian Active", {
          description: `Welcome back, ${user.email?.split('@')[0] || 'User'}! Monitoring your network...`,
          duration: 4000,
        });
      }, 1000);

      // Schedule network event notifications
      const timeouts = networkEvents.map(event => 
        setTimeout(() => {
          console.log("Triggering real-time notification:", event.message);
          
          if (event.type === "success") {
            toast.success(event.message, {
              description: event.description,
              duration: 4000,
            });
          } else if (event.type === "warning") {
            toast.warning(event.message, {
              description: event.description,
              duration: 5000,
            });
          } else {
            toast.info(event.message, {
              description: event.description,
              duration: 4000,
            });
          }
        }, event.delay)
      );

      // Periodic status updates - reduced frequency
      const statusInterval = setInterval(() => {
        const statusMessages = [
          "Network health: Excellent",
          "Security status: Protected", 
          "Connected devices: 12 active",
          "Bandwidth usage: 65% of capacity"
        ];
        
        const randomMessage = statusMessages[Math.floor(Math.random() * statusMessages.length)];
        toast.info("System Status", {
          description: randomMessage,
          duration: 3000,
        });
      }, 60000); // Every 60 seconds instead of 30

      return () => {
        clearTimeout(welcomeTimeout);
        timeouts.forEach(timeout => clearTimeout(timeout));
        clearInterval(statusInterval);
        console.log("Cleaned up real-time notifications");
      };
    }
  }, [user]);
};
