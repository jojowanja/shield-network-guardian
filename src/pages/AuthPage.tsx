
import { AuthorizationRequests } from "@/components/AuthorizationRequests";
import { DashboardLayout } from "@/components/DashboardLayout";

const AuthPage = () => {
  return (
    <DashboardLayout>
      <AuthorizationRequests />
    </DashboardLayout>
  );
};

export default AuthPage;
