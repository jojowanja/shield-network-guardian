
import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Shield, Star } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Basic network monitoring",
    icon: Shield,
    features: [
      "Basic device detection",
      "Simple security alerts",
      "Up to 10 devices",
      "Weekly reports",
      "Community support"
    ],
    tier: "free" as const,
    popular: false
  },
  {
    name: "Basic",
    price: "$9.99",
    period: "/month",
    description: "Enhanced monitoring and alerts",
    icon: Zap,
    features: [
      "All Free features",
      "Real-time threat detection",
      "Up to 50 devices",
      "Daily reports",
      "Guest network management",
      "Email support"
    ],
    tier: "basic" as const,
    popular: false
  },
  {
    name: "Premium",
    price: "$19.99",
    period: "/month",
    description: "Advanced security and analytics",
    icon: Crown,
    features: [
      "All Basic features",
      "Advanced threat scoring",
      "Unlimited devices",
      "Real-time analytics",
      "Bandwidth optimization",
      "VPN integration",
      "Priority support"
    ],
    tier: "premium" as const,
    popular: true
  },
  {
    name: "Enterprise",
    price: "$49.99",
    period: "/month",
    description: "Complete network security solution",
    icon: Star,
    features: [
      "All Premium features",
      "Multi-location support",
      "Custom integrations",
      "Advanced reporting",
      "Dedicated support",
      "SLA guarantee",
      "Custom training"
    ],
    tier: "enterprise" as const,
    popular: false
  }
];

const SubscriptionPage = () => {
  const { subscriptionTier, upgradeSubscription, isLoading } = useSubscription();
  const { toast } = useToast();

  const handleUpgrade = async (tier: string) => {
    try {
      await upgradeSubscription(tier);
      toast({
        title: "Subscription Updated",
        description: `Successfully upgraded to ${tier} plan!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upgrade subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Choose Your Plan</h1>
          <p className="text-muted-foreground">
            Upgrade your network security with premium features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = subscriptionTier === plan.tier;
            const canUpgrade = subscriptionTier === 'free' || 
              (subscriptionTier === 'basic' && ['premium', 'enterprise'].includes(plan.tier)) ||
              (subscriptionTier === 'premium' && plan.tier === 'enterprise');

            return (
              <Card 
                key={plan.name} 
                className={`relative ${
                  plan.popular 
                    ? 'ring-2 ring-primary shadow-lg scale-105' 
                    : isCurrentPlan 
                      ? 'ring-2 ring-green-500' 
                      : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-green-500 text-white">
                      Current Plan
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="text-3xl font-bold">
                    {plan.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full" 
                    variant={isCurrentPlan ? "outline" : plan.popular ? "default" : "outline"}
                    disabled={isCurrentPlan || isLoading || !canUpgrade}
                    onClick={() => handleUpgrade(plan.tier)}
                  >
                    {isCurrentPlan 
                      ? "Current Plan" 
                      : canUpgrade 
                        ? `Upgrade to ${plan.name}` 
                        : "Contact Sales"
                    }
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>All plans include a 30-day money-back guarantee</p>
          <p>Need help choosing? Contact our sales team</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPage;
