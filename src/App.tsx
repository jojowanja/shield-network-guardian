
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PulsePage from "./pages/PulsePage";
import ConnectPage from "./pages/ConnectPage";
import DevicesPage from "./pages/DevicesPage";
import AuthPage from "./pages/AuthPage";
import OverviewPage from "./pages/OverviewPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ExportPage from "./pages/ExportPage";
import SecurityPage from "./pages/SecurityPage";
import GuestAccessPage from "./pages/GuestAccessPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import WelcomePage from "./pages/WelcomePage";
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthGate } from "./components/AuthGate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthGate>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/welcome" element={<WelcomePage />} />
                
                {/* Protected Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/pulse" element={
                  <ProtectedRoute>
                    <PulsePage />
                  </ProtectedRoute>
                } />
                <Route path="/connect" element={
                  <ProtectedRoute>
                    <ConnectPage />
                  </ProtectedRoute>
                } />
                <Route path="/devices" element={
                  <ProtectedRoute>
                    <DevicesPage />
                  </ProtectedRoute>
                } />
                <Route path="/overview" element={
                  <ProtectedRoute>
                    <OverviewPage />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                <Route path="/security" element={
                  <ProtectedRoute>
                    <SecurityPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <AnalyticsPage />
                  </ProtectedRoute>
                } />
                <Route path="/export" element={
                  <ProtectedRoute>
                    <ExportPage />
                  </ProtectedRoute>
                } />
                <Route path="/guest-access" element={
                  <ProtectedRoute>
                    <GuestAccessPage />
                  </ProtectedRoute>
                } />
                <Route path="/subscription" element={
                  <ProtectedRoute>
                    <SubscriptionPage />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthGate>
          </TooltipProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
