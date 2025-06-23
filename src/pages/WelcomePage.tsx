
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Shield, Wifi, Users, BarChart3, Settings, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const WelcomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const welcomeSteps = [
    {
      icon: Shield,
      title: "Welcome to Shield Network Guardian",
      description: "Your comprehensive network security and management solution",
      action: "Get Started"
    },
    {
      icon: Wifi,
      title: "Network Detection",
      description: "We're scanning your network for connected devices...",
      action: "Continue"
    },
    {
      icon: Users,
      title: "Security Setup",
      description: "Setting up security protocols and guest access controls...",
      action: "Continue"
    },
    {
      icon: BarChart3,
      title: "Analytics Ready",
      description: "Your dashboard is ready! Start monitoring your network.",
      action: "Go to Dashboard"
    }
  ];

  useEffect(() => {
    // Show welcome toast
    toast.success(`Welcome back, ${user?.email?.split('@')[0] || 'User'}!`, {
      description: "Shield Network Guardian is initializing...",
      duration: 3000,
    });

    // Auto-progress through steps
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < welcomeSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [user]);

  const handleAction = () => {
    if (currentStep === welcomeSteps.length - 1) {
      navigate("/");
    } else {
      setCurrentStep(prev => Math.min(prev + 1, welcomeSteps.length - 1));
    }
  };

  const currentStepData = welcomeSteps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mb-4">
              <StepIcon size={32} className="text-white" />
            </div>
            <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center space-x-2">
              {welcomeSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <div className="space-y-3">
              {welcomeSteps.slice(0, currentStep + 1).map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle 
                    size={20} 
                    className={`${
                      index < currentStep ? 'text-green-500' : 
                      index === currentStep ? 'text-blue-500' : 'text-gray-300'
                    }`} 
                  />
                  <span className={`text-sm ${
                    index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>

            <Button onClick={handleAction} className="w-full">
              {currentStepData.action}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WelcomePage;
