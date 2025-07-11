
import { GuardianShield } from "@/components/GuardianShield";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RealtimeActivityFeed } from "@/components/RealtimeActivityFeed";
import { DownloadsManager } from "@/components/DownloadsManager";
import { UpgradePrompt } from "@/components/UpgradePrompt";
import { useSubscription } from "@/contexts/SubscriptionContext";

const Index = () => {
  const { isPremium } = useSubscription();
  
  // Simulate device count and usage data
  const deviceCount = 12;
  const usage = "high" as const;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="w-full">
          <GuardianShield />
        </div>
        
        {!isPremium && (
          <UpgradePrompt 
            deviceCount={deviceCount}
            usage={usage}
            currentPlan="home"
          />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <RealtimeActivityFeed />
          </div>
          
          <div className="xl:col-span-1">
            <DownloadsManager />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
