
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Wifi, Lock, BarChart3, CheckCircle, Activity, Database, Eye } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const loadingSteps = [
    { icon: Database, text: "Loading Network Resources...", delay: 500 },
    { icon: Shield, text: "Securing Connection...", delay: 1000 },
    { icon: Activity, text: "Analyzing Network Traffic...", delay: 1500 },
    { icon: Eye, text: "Monitoring Devices...", delay: 2000 },
    { icon: Lock, text: "Establishing Security Protocols...", delay: 2500 },
    { icon: CheckCircle, text: "Welcome to Shield Network Guardian!", delay: 3000 }
  ];

  const [currentStep, setCurrentStep] = useState(-1);

  const handleGetStarted = () => {
    setIsLoading(true);
    setCurrentStep(0);
    
    loadingSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        if (index === loadingSteps.length - 1) {
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        }
      }, step.delay);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          {/* Animated Logo */}
          <div className="mx-auto w-32 h-32 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-3xl flex items-center justify-center mb-8 shadow-2xl animate-pulse-soft">
            <Shield size={64} className="text-white animate-float" />
          </div>

          {/* Loading Steps */}
          <div className="space-y-6">
            {loadingSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index <= currentStep;
              const isCurrent = index === currentStep;
              
              return (
                <div
                  key={index}
                  className={`flex items-center justify-center space-x-4 transition-all duration-500 ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-30 scale-95'
                  }`}
                >
                  <div className={`p-3 rounded-full ${isCurrent ? 'bg-cyan-400 animate-pulse' : 'bg-white/20'}`}>
                    <StepIcon 
                      size={24} 
                      className={`${isCurrent ? 'text-slate-900' : 'text-white'} transition-colors duration-300`} 
                    />
                  </div>
                  <span className={`text-lg font-medium ${isCurrent ? 'text-cyan-300' : 'text-white'} transition-colors duration-300`}>
                    {step.text}
                  </span>
                  {isActive && index < currentStep && (
                    <CheckCircle size={20} className="text-green-400 animate-fade-in" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-8 w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${((currentStep + 1) / loadingSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-3xl flex items-center justify-center mb-8 shadow-2xl animate-float">
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
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 animate-fade-in delay-300 hover:scale-105 transition-transform duration-300">
            <Wifi className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Network Monitoring</h3>
            <p className="text-blue-200 text-sm">Real-time device tracking and bandwidth analysis</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 animate-fade-in delay-500 hover:scale-105 transition-transform duration-300">
            <Lock className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Security Protection</h3>
            <p className="text-blue-200 text-sm">Advanced threat detection and network security</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 animate-fade-in delay-700 hover:scale-105 transition-transform duration-300">
            <BarChart3 className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Analytics & Insights</h3>
            <p className="text-blue-200 text-sm">Detailed reports and performance analytics</p>
          </div>
        </div>

        {/* Get Started Button */}
        <Button 
          onClick={handleGetStarted}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-2xl animate-fade-in delay-1000 hover:scale-105 transition-all duration-300"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
