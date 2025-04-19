
import { PulseBoost } from "@/components/PulseBoost";
import { NetworkSecurityCheck } from "@/components/NetworkSecurityCheck";
import { DashboardLayout } from "@/components/DashboardLayout";

const PulsePage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PulseBoost />
        <NetworkSecurityCheck />
      </div>
    </DashboardLayout>
  );
};

export default PulsePage;
