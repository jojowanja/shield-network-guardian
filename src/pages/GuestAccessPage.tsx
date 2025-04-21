
import { DashboardLayout } from "@/components/DashboardLayout";
import { SmartGuestAccess } from "@/components/SmartGuestAccess";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const GuestAccessPage = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <SmartGuestAccess />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default GuestAccessPage;
