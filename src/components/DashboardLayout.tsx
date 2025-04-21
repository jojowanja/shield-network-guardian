
import { ReactNode, useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Bell, Search, User, ChartBar, FileText, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const isMobile = useIsMobile();

  const handleSignOut = () => {
    signOut();
    navigate('/auth');
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-background">
      {/* Desktop sidebar - only show when not mobile */}
      {!isMobile && <DashboardSidebar />}
      
      {/* Mobile sidebar - conditionally shown via Sheet component */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[85%] max-w-[300px] sm:w-[350px]">
            <DashboardSidebar />
          </SheetContent>
        </Sheet>
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
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
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Search..." 
                className="pl-10 rounded-full bg-gray-100 dark:bg-muted border-none focus-visible:ring-offset-0"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2 font-medium">Notifications</div>
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">New device connected</p>
                    <p className="text-sm text-muted-foreground">iPhone 13 Pro has connected to your network</p>
                    <p className="text-xs text-muted-foreground">10 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-status-warning">Security Alert</p>
                    <p className="text-sm text-muted-foreground">Unusual login attempt detected</p>
                    <p className="text-xs text-muted-foreground">25 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">Network Status</p>
                    <p className="text-sm text-muted-foreground">Smart Connect optimized your network</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="h-8 w-px bg-border hidden sm:block"></div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-2">
                  <div className="w-8 h-8 rounded-full bg-shield flex items-center justify-center text-white">
                    <span className="font-semibold">{user?.email?.substring(0, 2).toUpperCase() || "JD"}</span>
                  </div>
                  <span className="font-medium text-sm hidden md:inline-block">
                    {user?.email?.split('@')[0] || "John Doe"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
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
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
