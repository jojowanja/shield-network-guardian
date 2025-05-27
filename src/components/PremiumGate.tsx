
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Lock } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface PremiumGateProps {
  children: React.ReactNode;
  feature: string;
  description?: string;
  requiredTier?: 'basic' | 'premium' | 'enterprise';
}

export const PremiumGate = ({ 
  children, 
  feature, 
  description,
  requiredTier = 'basic' 
}: PremiumGateProps) => {
  const { isPremium, subscriptionTier } = useSubscription();

  const tierLevels = {
    free: 0,
    basic: 1,
    premium: 2,
    enterprise: 3
  };

  const hasAccess = tierLevels[subscriptionTier] >= tierLevels[requiredTier];

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-50" />
      <CardHeader className="relative">
        <div className="flex items-center space-x-2">
          <Crown className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-lg">Premium Feature</CardTitle>
        </div>
        <CardDescription>
          {description || `${feature} requires a ${requiredTier} subscription or higher.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="relative">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
            <div className="text-center">
              <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">
                Upgrade to unlock {feature}
              </p>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade Now
              </Button>
            </div>
          </div>
          <div className="opacity-30 pointer-events-none">
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
