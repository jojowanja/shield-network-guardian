
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { AuthGate } from "@/components/AuthGate";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import WelcomePage from "./pages/WelcomePage";
import DevicesPage from "./pages/DevicesPage";
import GuestAccessPage from "./pages/GuestAccessPage";
import SecurityPage from "./pages/SecurityPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import ExportPage from "./pages/ExportPage";
import PulsePage from "./pages/PulsePage";
import InteractivePage from "./pages/InteractivePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <SubscriptionProvider>
            <AuthGate>
              <div className="min-h-screen bg-background">
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/welcome" element={<WelcomePage />} />
                  <Route path="/" element={<Index />} />
                  <Route path="/devices" element={<DevicesPage />} />
                  <Route path="/guest-access" element={<GuestAccessPage />} />
                  <Route path="/security" element={<SecurityPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/subscription" element={<SubscriptionPage />} />
                  <Route path="/export" element={<ExportPage />} />
                  <Route path="/pulse" element={<PulsePage />} />
                  <Route path="/interactive" element={<InteractivePage />} />
                </Routes>
                <Toaster />
                <SonnerToaster />
              </div>
            </AuthGate>
          </SubscriptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
