import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import Index from "./pages/Index";
import DevicesPage from "./pages/DevicesPage";
import GuestAccessPage from "./pages/GuestAccessPage";
import SecurityPage from "./pages/SecurityPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import ExportPage from "./pages/ExportPage";
import PulsePage from "./pages/PulsePage";
import InteractivePage from "./pages/InteractivePage";

function App() {
  return (
    <QueryClient defaultOptions={{
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    }}>
      <BrowserRouter>
        <AuthProvider>
          <SubscriptionProvider>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <div className="min-h-screen bg-background">
                <Routes>
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
              </div>
            </ThemeProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
