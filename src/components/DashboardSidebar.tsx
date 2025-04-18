
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ShieldCheck, Activity, Wifi, Smartphone, 
  UserCheck, BarChart3, Settings, Menu, X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  icon: React.ElementType;
  label: string;
  path: string;
};

const navItems: NavItem[] = [
  { icon: ShieldCheck, label: "Guardian Shield", path: "/" },
  { icon: Activity, label: "Pulse Boost", path: "/pulse" },
  { icon: Wifi, label: "Smart Connect", path: "/connect" },
  { icon: Smartphone, label: "Device Management", path: "/devices" },
  { icon: UserCheck, label: "Authorization", path: "/auth" },
  { icon: BarChart3, label: "Network Overview", path: "/overview" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();

  return (
    <div
      className={cn(
        "h-screen bg-shield text-white flex flex-col transition-all duration-300 border-r border-shield-secondary",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-shield-secondary">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <ShieldCheck className="text-shield-accent" size={24} />
            <h1 className="font-bold text-xl">Shield Guard</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-shield-secondary"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center py-3 px-4 transition-colors",
              pathname === item.path
                ? "bg-shield-accent text-white"
                : "text-gray-300 hover:bg-shield-muted hover:text-white",
              collapsed ? "justify-center" : "justify-start"
            )}
          >
            <item.icon size={20} />
            {!collapsed && <span className="ml-3">{item.label}</span>}
          </Link>
        ))}
      </div>
      
      <div className="p-4 border-t border-shield-secondary">
        {!collapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-shield-secondary flex items-center justify-center">
              <span className="font-semibold">JD</span>
            </div>
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-xs text-gray-300">Admin</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 mx-auto rounded-full bg-shield-secondary flex items-center justify-center">
            <span className="font-semibold">JD</span>
          </div>
        )}
      </div>
    </div>
  );
};
