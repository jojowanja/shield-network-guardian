
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PasswordStrengthChecker } from "@/components/PasswordStrengthChecker";
import { WifiSecurityScore } from "@/components/WifiSecurityScore";
import { SmartGuestAccess } from "@/components/SmartGuestAccess";
import { SubscriptionOptimizer } from "@/components/SubscriptionOptimizer";
import { NetworkHealth } from "@/components/NetworkHealth";
import { Shield, Lock, User, BarChart } from "lucide-react";

const SecurityPage = () => {
  const [passwordStrength] = useState(3);
  const [unknownDevices] = useState(1);
  const [guestAccessFrequency] = useState(2);
  const [securePasswordUsage] = useState(true);
  
  const healthItems = [
    { name: "Firewall", status: "good" as const, message: "Active" },
    { name: "DNS Protection", status: "good" as const, message: "Secured" },
    { name: "Network Traffic", status: "warning" as const, message: "Unusual Activity" },
    { name: "Device Security", status: "good" as const, message: "All Protected" },
    { name: "Firmware", status: "good" as const, message: "Up to date" }
  ];
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <NetworkHealth items={healthItems} />
          </div>
          <div className="md:col-span-1">
            <WifiSecurityScore 
              passwordStrength={passwordStrength} 
              unknownDevices={unknownDevices} 
              guestAccessFrequency={guestAccessFrequency}
              securePasswordUsage={securePasswordUsage}
            />
          </div>
        </div>
      
        <Tabs defaultValue="guest-access" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 md:w-[600px]">
            <TabsTrigger value="guest-access" className="flex items-center gap-2">
              <User size={16} />
              <span className="hidden sm:inline">Guest Access</span>
              <span className="sm:hidden">Guests</span>
            </TabsTrigger>
            <TabsTrigger value="password-strength" className="flex items-center gap-2">
              <Lock size={16} />
              <span className="hidden sm:inline">Password Strength</span>
              <span className="sm:hidden">Password</span>
            </TabsTrigger>
            <TabsTrigger value="security-score" className="flex items-center gap-2">
              <Shield size={16} />
              <span className="hidden sm:inline">Security Score</span>
              <span className="sm:hidden">Security</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <BarChart size={16} />
              <span className="hidden sm:inline">Subscription</span>
              <span className="sm:hidden">Plan</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="guest-access">
            <SmartGuestAccess />
          </TabsContent>
          
          <TabsContent value="password-strength">
            <PasswordStrengthChecker />
          </TabsContent>
          
          <TabsContent value="security-score">
            <WifiSecurityScore 
              passwordStrength={passwordStrength} 
              unknownDevices={unknownDevices} 
              guestAccessFrequency={guestAccessFrequency}
              securePasswordUsage={securePasswordUsage}
            />
          </TabsContent>
          
          <TabsContent value="subscription">
            <SubscriptionOptimizer />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SecurityPage;
