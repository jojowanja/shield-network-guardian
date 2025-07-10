
import { DashboardLayout } from "@/components/DashboardLayout";
import { PremiumFeatures } from "@/components/PremiumFeatures";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Crown, Home, GraduationCap, Building2, Palette } from "lucide-react";

const SubscriptionPage = () => {
  const { subscriptionTier, planType, isPremium, setPlanType, upgradeSubscription, getThemeClass } = useSubscription();

  const planOptions = [
    { 
      key: 'home' as const, 
      icon: Home, 
      title: '🏠 Home', 
      description: 'Perfect for families and home networks',
      price: 'KES 300/month'
    },
    { 
      key: 'school' as const, 
      icon: GraduationCap, 
      title: '🎓 School', 
      description: 'Educational institutions and libraries',
      price: 'KES 1,500/month'
    },
    { 
      key: 'work' as const, 
      icon: Building2, 
      title: '💼 Work', 
      description: 'Businesses and professional environments',
      price: 'KES 3,000/month'
    },
  ];

  const handleThemeDemo = () => {
    // Toggle between basic and premium theme for demo
    const currentTheme = document.body.className;
    if (currentTheme.includes('premium-theme')) {
      document.body.className = 'basic-theme';
    } else {
      document.body.className = 'premium-theme bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
          <p className="text-muted-foreground">
            Manage your subscription and unlock premium features for your network
          </p>
        </div>

        {/* Current Plan Status */}
        <Card className={`${isPremium ? 'border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20' : ''}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${isPremium ? 'bg-amber-100 dark:bg-amber-800' : 'bg-muted'}`}>
                  <Crown className={`h-5 w-5 ${isPremium ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <CardTitle className="capitalize">
                    {subscriptionTier} Plan - {planType}
                  </CardTitle>
                  <CardDescription>
                    {isPremium ? 'You have access to all premium features' : 'Upgrade to unlock advanced features'}
                  </CardDescription>
                </div>
              </div>
              {isPremium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium Active
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Plan Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Plan Type</CardTitle>
            <CardDescription>
              Select the plan that best fits your network environment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {planOptions.map((plan) => {
                const PlanIcon = plan.icon;
                const isSelected = planType === plan.key;
                
                return (
                  <Card 
                    key={plan.key}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      isSelected ? 'ring-2 ring-primary border-primary' : ''
                    }`}
                    onClick={() => setPlanType(plan.key)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="mb-3">
                        <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          <PlanIcon size={24} />
                        </div>
                      </div>
                      <h3 className="font-semibold mb-1">{plan.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{plan.description}</p>
                      <Badge variant={isSelected ? "default" : "secondary"}>
                        Premium: {plan.price}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Theme Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="mr-2 h-5 w-5" />
              UI Theme Preview
            </CardTitle>
            <CardDescription>
              See how your interface changes with premium subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  Current: {isPremium ? 'Premium Gradient Theme' : 'Basic Light Theme'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isPremium 
                    ? 'Sleek gradients, enhanced colors, and premium styling' 
                    : 'Clean and simple interface with basic styling'
                  }
                </p>
              </div>
              <Button onClick={handleThemeDemo} variant="outline">
                Toggle Theme Demo
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <PremiumFeatures />
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPage;
