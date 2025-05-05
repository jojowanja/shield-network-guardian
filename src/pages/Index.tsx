
import { GuardianShield } from "@/components/GuardianShield";
import { DashboardLayout } from "@/components/DashboardLayout";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="w-full">
        <GuardianShield />
      </div>
    </DashboardLayout>
  );
};

export default Index;
