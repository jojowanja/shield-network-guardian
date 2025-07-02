
import { DashboardLayout } from "@/components/DashboardLayout";
import { PremiumFeatures } from "@/components/PremiumFeatures";

const SubscriptionPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription and unlock premium features
          </p>
        </div>
        
        <PremiumFeatures />
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPage;
