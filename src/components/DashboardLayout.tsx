
import { ReactNode } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-card h-16 border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center space-x-4 w-1/3">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Search..." 
                className="pl-10 rounded-full bg-gray-100 dark:bg-muted border-none"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
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
            
            <div className="h-8 w-px bg-border"></div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-shield flex items-center justify-center text-white">
                <span className="font-semibold">JD</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
