
import { DashboardLayout } from "@/components/DashboardLayout";
import { ExportData } from "@/components/ExportData";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const ExportPage = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ExportData />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default ExportPage;
