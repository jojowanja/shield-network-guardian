
import { useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useRealtimeToasts = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Show welcome toast when user logs in
      toast.success("Welcome to Shield Network Guardian!", {
        description: `Successfully logged in as ${user.email}`,
        duration: 4000,
      });

      // Simulate real-time network events
      const networkEvents = [
        { message: "Network scan completed", type: "info", delay: 3000 },
        { message: "Security protocols updated", type: "success", delay: 6000 },
        { message: "New device detected on network", type: "warning", delay: 9000 },
      ];

      const timeouts = networkEvents.map(event => 
        setTimeout(() => {
          if (event.type === "success") {
            toast.success(event.message);
          } else if (event.type === "warning") {
            toast.warning(event.message);
          } else {
            toast.info(event.message);
          }
        }, event.delay)
      );

      return () => timeouts.forEach(timeout => clearTimeout(timeout));
    }
  }, [user]);
};
