
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Shield, Zap, Eye, BarChart3, Globe, Lock } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Link } from "react-router-dom";

const premiumFeatures = [
  {
    icon: Shield,
    title: "Advanced Threat Detection",
    description: "AI-powered threat scoring and real-time security monitoring",
    tier: "basic" as const,
  },
  {
    icon: Eye,
    title: "Real-time Network Monitoring",
    description: "Live traffic analysis and bandwidth optimization",
    tier: "basic" as const,
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Deep insights into network performance and usage patterns",
    tier: "premium" as const,
  },
  {
    icon: Globe,
    title: "VPN Integration",
    description: "Secure remote access and multi-location support",
    tier: "premium" as const,
  },
  {
    icon: Zap,
    title: "Bandwidth Optimization",
    description: "Intelligent traffic shaping and QoS management",
    tier: "premium" as const,
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Custom integrations and dedicated security features",
    tier: "enterprise" as const,
  },
];

export const PremiumFeatures = () => {
  const { subscriptionTier, isPremium } = useSubscription();

  const tierLevels = {
    free: 0,
    basic: 1,
    premium: 2,
    enterprise: 3
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Crown className="h-5 w-5 text-amber-600" />
          <CardTitle>Premium Features</CardTitle>
        </div>
        <CardDescription>
          Unlock advanced security and monitoring capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {premiumFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const hasAccess = tierLevels[subscriptionTier] >= tierLevels[feature.tier];
            
            return (
              <div 
                key={index}
                className={`p-4 rounded-lg border transition-all ${
                  hasAccess 
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                    : 'border-border bg-muted/30'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    hasAccess ? 'bg-green-100 dark:bg-green-800' : 'bg-muted'
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      hasAccess ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-sm">{feature.title}</h4>
                      <Badge 
                        variant={hasAccess ? "default" : "secondary"}
                        className={`text-xs capitalize ${
                          hasAccess ? 'bg-green-500' : ''
                        }`}
                      >
                        {hasAccess ? 'Active' : feature.tier}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!isPremium && (
          <div className="pt-4 border-t">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Upgrade to unlock all premium features and enhance your network security
              </p>
              <Link to="/subscription">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                  <Crown className="mr-2 h-4 w-4" />
                  View Plans
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
