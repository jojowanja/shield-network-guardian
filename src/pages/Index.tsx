
import { GuardianShield } from "@/components/GuardianShield";
import { PulseBoost } from "@/components/PulseBoost";
import { SmartConnect } from "@/components/SmartConnect";
import { NetworkOverview } from "@/components/NetworkOverview";
import { DeviceManagement } from "@/components/DeviceManagement";
import { AuthorizationRequests } from "@/components/AuthorizationRequests";
import { DashboardLayout } from "@/components/DashboardLayout";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Monitor and optimize your network security and performance
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <GuardianShield />
          <PulseBoost />
          <SmartConnect />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <AuthorizationRequests />
          <DeviceManagement />
        </div>
        
        <NetworkOverview />
      </div>
    </DashboardLayout>
  );
};

export default Index;
