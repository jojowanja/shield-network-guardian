
import {
  Home as HomeIcon,
  Activity as ActivityIcon,
  Wifi as WifiIcon,
  Smartphone as SmartphoneIcon,
  LayoutDashboard as LayoutDashboardIcon,
  Settings as SettingsIcon,
  User as UserIcon,
  Shield as ShieldIcon,
  ShieldCheck as ShieldCheckIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const isActiveRoute = (route: string) => {
    return location.pathname === route;
  };

  return (
    <aside className="hidden sm:flex sm:w-64 sm:flex-col sm:min-h-screen border-r border-border bg-card">
      <div className="flex flex-col flex-1">
        <div className="flex items-center h-16 border-b border-border px-6">
          <Link to="/" className="flex items-center space-x-2">
            <ShieldIcon size={24} className="text-shield" />
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-shield to-shield-secondary">
              Shield
            </span>
          </Link>
        </div>
        <div className="flex flex-col flex-1 pt-6 px-4">
          <nav className="flex-1 space-y-1">
            <NavLink to="/" isActive={isActiveRoute("/")} icon={<HomeIcon size={20} />} label="Home" />
            <NavLink to="/pulse" isActive={isActiveRoute("/pulse")} icon={<ActivityIcon size={20} />} label="Pulse" />
            <NavLink to="/connect" isActive={isActiveRoute("/connect")} icon={<WifiIcon size={20} />} label="Connect" />
            <NavLink to="/devices" isActive={isActiveRoute("/devices")} icon={<SmartphoneIcon size={20} />} label="Devices" />
            <NavLink to="/overview" isActive={isActiveRoute("/overview")} icon={<LayoutDashboardIcon size={20} />} label="Overview" />
            <NavLink to="/security" isActive={isActiveRoute("/security")} icon={<ShieldCheckIcon size={20} />} label="Security" />
            <NavLink to="/export" isActive={isActiveRoute("/export")} icon={<FileText size={20} />} label="Export" />
            <NavLink to="/guest-access" isActive={isActiveRoute("/guest-access")} icon={<UserIcon size={20} />} label="Guest Access" />
            <div className="mt-6 mb-3">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                Account
              </div>
            </div>
            <NavLink to="/settings" isActive={isActiveRoute("/settings")} icon={<SettingsIcon size={20} />} label="Settings" />
            <NavLink to="/profile" isActive={isActiveRoute("/profile")} icon={<UserIcon size={20} />} label="Profile" />
          </nav>

          <div className="mt-auto mb-8 space-y-6">
            <div className="px-3">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Storage</span>
                  <span className="text-xs text-muted-foreground">75%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-shield w-3/4"></div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>7.5 GB used</span>
                  <span>10 GB total</span>
                </div>
              </div>
            </div>

            {user && (
              <div className="px-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      <span className="font-semibold">{user.email?.substring(0, 2).toUpperCase()}</span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Free Plan</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
