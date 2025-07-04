
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Wifi, Lock, BarChart3 } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Logo */}
        <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
          <Shield size={48} className="text-white" />
        </div>

        {/* Main Heading */}
        <h1 className="text-6xl font-bold text-white mb-6 animate-fade-in">
          Shield Network Guardian
        </h1>
        
        <p className="text-xl text-blue-200 mb-12 max-w-2xl mx-auto animate-fade-in delay-200">
          Advanced network monitoring and security solution for your home and business. 
          Monitor devices, analyze traffic, and protect your network in real-time.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 animate-fade-in delay-300">
            <Wifi className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Network Monitoring</h3>
            <p className="text-blue-200 text-sm">Real-time device tracking and bandwidth analysis</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 animate-fade-in delay-500">
            <Lock className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Security Protection</h3>
            <p className="text-blue-200 text-sm">Advanced threat detection and network security</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 animate-fade-in delay-700">
            <BarChart3 className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Analytics & Insights</h3>
            <p className="text-blue-200 text-sm">Detailed reports and performance analytics</p>
          </div>
        </div>

        {/* Get Started Button */}
        <Button 
          onClick={handleGetStarted}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-2xl animate-fade-in delay-1000"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
