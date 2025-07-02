
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
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
import ConnectPage from "./pages/ConnectPage";
import NotFound from "./pages/NotFound";

// Create QueryClient instance outside of component to avoid recreating
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
        <SubscriptionProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/connect" element={<ConnectPage />} />
              <Route path="/devices" element={<DevicesPage />} />
              <Route path="/guest-access" element={<GuestAccessPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/export" element={<ExportPage />} />
              <Route path="/pulse" element={<PulsePage />} />
              <Route path="/interactive" element={<InteractivePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <SonnerToaster />
          </div>
        </SubscriptionProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
