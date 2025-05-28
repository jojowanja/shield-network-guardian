
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, CheckCircle, Wifi, Lock, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const WelcomePage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const steps = [
    { icon: Shield, text: "Initializing Shield Network Guardian", color: "text-blue-400" },
    { icon: Wifi, text: "Scanning network infrastructure", color: "text-green-400" },
    { icon: Lock, text: "Establishing secure connections", color: "text-amber-400" },
    { icon: Users, text: "Configuring device monitoring", color: "text-purple-400" },
    { icon: CheckCircle, text: "Welcome to your secure network!", color: "text-emerald-400" }
  ];

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        const stepIndex = Math.floor(newProgress / 20);
        setCurrentStep(Math.min(stepIndex, steps.length - 1));
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate("/"), 1000);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [user, navigate]);

  const CurrentIcon = steps[currentStep]?.icon || Shield;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Shield</h1>
          <p className="text-blue-200">Network Guardian</p>
        </div>

        {/* Current Step Icon */}
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border border-white/20">
            <CurrentIcon size={32} className={steps[currentStep]?.color || "text-white"} />
          </div>
          <p className="text-white text-lg font-medium">
            {steps[currentStep]?.text || "Loading..."}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm border border-white/30">
            <div 
              className="bg-gradient-to-r from-blue-400 to-cyan-400 h-full rounded-full transition-all duration-300 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-blue-200 text-sm mt-2">{Math.round(progress)}% Complete</p>
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-center space-x-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentStep 
                  ? 'bg-gradient-to-r from-blue-400 to-cyan-400 shadow-lg' 
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Welcome Message */}
        {progress >= 100 && (
          <div className="mt-8 animate-fade-in">
            <p className="text-emerald-400 text-lg font-semibold">
              Welcome back, {user?.email?.split('@')[0]}!
            </p>
            <p className="text-blue-200 text-sm mt-1">
              Your network is secure and ready
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomePage;
