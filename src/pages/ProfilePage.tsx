
import { DashboardLayout } from "@/components/DashboardLayout";
import { UserProfile } from "@/components/UserProfile";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const ProfilePage = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <UserProfile />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default ProfilePage;
