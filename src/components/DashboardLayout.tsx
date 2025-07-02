
import { ReactNode, useState } from "react";
import { Bell, Search, User, ChartBar, FileText, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useRealtimeToasts } from "@/hooks/useRealtimeToasts";
import { useSearch } from "@/hooks/useSearch";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/contexts/AuthContext";
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
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const isMobile = useIsMobile();
  const { query, setQuery, results, isOpen, handleSelect, clearSearch } = useSearch();
  const { notifications, unreadCount, handleNotificationClick, markAllAsRead } = useNotifications();
  
  // Initialize real-time toasts
  useRealtimeToasts();

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

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const getUserDisplayName = () => {
    if (!user) return "Guest User";
    return user.email?.split('@')[0] || "User";
  };

  const getUserInitials = () => {
    if (!user) return "GU";
    const email = user.email || "";
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col h-screen max-h-screen w-full overflow-hidden bg-gray-50 dark:bg-background">
      <div className="flex flex-1 overflow-hidden w-full">
        {/* Desktop sidebar */}
        {!isMobile && (
          <div className="w-64 bg-white dark:bg-card border-r border-border flex flex-col">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Dashboard</h2>
              <p className="text-sm text-muted-foreground">
                Manage your network and connected devices.
              </p>
            </div>
            
            <div className="flex flex-col gap-1 px-3 py-4 flex-1">
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="justify-start px-4 py-2 rounded-md hover:bg-secondary"
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>

            <div className="mt-auto px-6 border-t py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{getUserDisplayName()}</span>
                    <span className="text-xs text-muted-foreground">
                      {user ? "Authenticated" : "Testing Mode"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  {user && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSignOut}
                      className="h-8 w-8"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Mobile sidebar */}
        {isMobile && (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="p-0 w-[85%] max-w-[300px] sm:w-[350px]">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">Dashboard</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your network and connected devices.
                </p>
              </div>
              
              <div className="flex flex-col gap-1 px-3 py-4 flex-1">
                {menuItems.map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className="justify-start px-4 py-2 rounded-md hover:bg-secondary"
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
              </div>

              <div className="mt-auto px-6 border-t py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{getUserDisplayName()}</span>
                      <span className="text-xs text-muted-foreground">
                        {user ? "Authenticated" : "Testing Mode"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    {user && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSignOut}
                        className="h-8 w-8"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
        
        <div className="flex flex-col flex-1 overflow-hidden w-full min-w-0">
          <header className="bg-white dark:bg-card h-16 border-b border-border flex items-center justify-between px-4 md:px-6 shadow-sm">
            <div className="flex items-center space-x-4">
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu size={20} />
                </Button>
              )}
              
              {/* Functional Search */}
              <div className="relative w-full max-w-md hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Search devices, settings, security..." 
                  className="pl-10 pr-10 rounded-full bg-gray-100 dark:bg-muted border-none focus-visible:ring-offset-0"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
                
                {/* Search Results Dropdown */}
                {isOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-card rounded-md shadow-lg border border-border z-50 max-h-64 overflow-y-auto">
                    {results.map((result) => (
                      <div
                        key={result.id}
                        className="p-3 hover:bg-gray-50 dark:hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                        onClick={() => handleSelect(result)}
                      >
                        <div className="font-medium text-sm">{result.title}</div>
                        <div className="text-xs text-muted-foreground">{result.description}</div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <ThemeToggle />
              
              {/* Functional Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between p-3 border-b">
                    <div className="font-medium">Notifications</div>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={markAllAsRead}
                      >
                        Mark all read
                      </Button>
                    )}
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <DropdownMenuItem 
                          key={notification.id}
                          className="p-3 cursor-pointer flex flex-col items-start space-y-1"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start justify-between w-full">
                            <div className="flex flex-col gap-1 flex-1">
                              <div className="flex items-center gap-2">
                                <p className={cn(
                                  "font-medium text-sm",
                                  notification.type === "warning" && "text-orange-600",
                                  notification.type === "error" && "text-red-600",
                                  notification.type === "success" && "text-green-600"
                                )}>
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{notification.description}</p>
                              <p className="text-xs text-muted-foreground">{formatTimeAgo(notification.timestamp)}</p>
                              {notification.actionRequired && (
                                <p className="text-xs text-blue-600 dark:text-blue-400">Action required</p>
                              )}
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="h-8 w-px bg-border hidden sm:block"></div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-2">
                    <div className="w-8 h-8 rounded-full bg-shield flex items-center justify-center text-white">
                      <span className="font-semibold">{getUserInitials()}</span>
                    </div>
                    <span className="font-medium text-sm hidden md:inline-block">
                      {getUserDisplayName()}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/analytics" className="cursor-pointer flex items-center">
                      <ChartBar className="mr-2 h-4 w-4" />
                      <span>Analytics</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/export" className="cursor-pointer flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Export Data</span>
                    </Link>
                  </DropdownMenuItem>
                  {user && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full min-w-0">
            <div className="w-full max-w-[100%] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
