
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Home,
  Shield,
  Wifi,
  MonitorSpeaker,
  Users,
  ShieldCheck,
  BarChart3,
  FileDown,
  Settings,
  CreditCard,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar = ({ isOpen, onClose }: DashboardSidebarProps) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: "Overview", path: "/" },
    { icon: Shield, label: "Pulse", path: "/pulse" },
    { icon: Wifi, label: "Connect", path: "/connect" },
    { icon: MonitorSpeaker, label: "Devices", path: "/devices" },
    { icon: Users, label: "Guest Access", path: "/guest-access" },
    { icon: ShieldCheck, label: "Security", path: "/security" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Activity, label: "Interactive", path: "/interactive" },
    { icon: FileDown, label: "Export", path: "/export" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: CreditCard, label: "Subscription", path: "/subscription" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 px-2 text-base rounded-full hover:bg-secondary md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 pt-6 border-r">
        <SheetHeader className="px-6 pb-4">
          <SheetTitle>Dashboard</SheetTitle>
          <SheetDescription>
            Manage your network and connected devices.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-1 px-3">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="justify-start px-4 py-2 rounded-md hover:bg-secondary"
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          ))}
        </div>

        <div className="mt-6 px-6 border-t py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">Guest User</span>
                <span className="text-xs text-muted-foreground">
                  Testing Mode
                </span>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DashboardSidebar;
