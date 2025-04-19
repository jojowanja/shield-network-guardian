
import { DashboardLayout } from "@/components/DashboardLayout";
import { EnhancedAnalytics } from "@/components/EnhancedAnalytics";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const AnalyticsPage = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <EnhancedAnalytics />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AnalyticsPage;
