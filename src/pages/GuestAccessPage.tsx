
import { DashboardLayout } from "@/components/DashboardLayout";
import { SmartGuestAccessEnhanced } from "@/components/SmartGuestAccessEnhanced";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const GuestAccessPage = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <SmartGuestAccessEnhanced />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default GuestAccessPage;
