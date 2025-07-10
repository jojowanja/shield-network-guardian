import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Shield, 
  Zap, 
  Eye, 
  BarChart3, 
  Globe, 
  Lock, 
  Wifi, 
  Users, 
  Router,
  AlertTriangle,
  TrendingUp,
  BrainCircuit,
  UserCheck,
  FileText,
  Palette,
  MapPin
} from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Link } from "react-router-dom";

const planFeatures = {
  home: [
    { icon: Eye, title: "Device Management", description: "Show all connected devices (IP/MAC)", tier: "basic", category: "📶 Device Management" },
    { icon: Users, title: "Usage Limits", description: "Show device count vs plan limits", tier: "basic", category: "🔌 Usage Limit" },
    { icon: AlertTriangle, title: "Network Alerts", description: "Warn when overloaded or device limit exceeded", tier: "basic", category: "🚨 Alerts" },
    { icon: BarChart3, title: "Speed Monitor", description: "Download, upload, ping with historical trends", tier: "basic", category: "📊 Speed Monitor" },
    { icon: BrainCircuit, title: "Smart Suggestions", description: "Restart router, remove idle devices", tier: "premium", category: "💡 Smart Suggestions" },
    { icon: TrendingUp, title: "Optimization Tips", description: "ISP/package based improvement suggestions", tier: "premium", category: "⚙️ Optimization Tips" },
    { icon: Wifi, title: "Guest WiFi", description: "Temporary WiFi with auto-expiry", tier: "premium", category: "📱 Guest WiFi" },
    { icon: UserCheck, title: "Auto-Disconnect", description: "Remove inactive or suspicious devices", tier: "premium", category: "🚫 Auto-Disconnect" },
    { icon: BrainCircuit, title: "AI Advice", description: "Router upgrades or ISP switch recommendations", tier: "premium", category: "🧠 AI Advice" },
    { icon: FileText, title: "Weekly Reports", description: "Email/PDF performance + recommendations", tier: "premium", category: "📈 Weekly Reports" },
    { icon: Palette, title: "Premium Theming", description: "Sleek gradient + dark mode", tier: "premium", category: "🎨 Theming" },
    { icon: MapPin, title: "Multi-Location", description: "Manage up to 5 network locations", tier: "premium", category: "🌐 Multi-Location" },
  ],
  school: [
    { icon: Users, title: "Student Device Monitoring", description: "Track all student devices and usage", tier: "basic", category: "👥 Student Management" },
    { icon: Shield, title: "Basic Content Filtering", description: "Block inappropriate content", tier: "basic", category: "🔒 Content Control" },
    { icon: BarChart3, title: "Network Performance", description: "Monitor bandwidth and speed", tier: "basic", category: "📊 Performance" },
    { icon: Lock, title: "Advanced Content Filtering", description: "Granular content control by category", tier: "premium", category: "🔒 Advanced Security" },
    { icon: Router, title: "Classroom Segmentation", description: "Separate network access by classroom", tier: "premium", category: "🏫 Network Segmentation" },
    { icon: BarChart3, title: "Student Analytics", description: "Detailed usage and behavior reports", tier: "premium", category: "📈 Analytics" },
    { icon: UserCheck, title: "Access Controls", description: "Time-based and device-based restrictions", tier: "premium", category: "⏰ Access Management" },
    { icon: TrendingUp, title: "Educational Optimization", description: "Optimize for learning platforms", tier: "premium", category: "📚 Education Focus" },
    { icon: MapPin, title: "Multi-Campus Support", description: "Manage multiple school locations", tier: "premium", category: "🏢 Multi-Campus" },
  ],
  work: [
    { icon: Eye, title: "Employee Device Tracking", description: "Monitor all workplace devices", tier: "basic", category: "💼 Device Management" },
    { icon: Shield, title: "Basic Security Monitoring", description: "Detect basic security threats", tier: "basic", category: "🔒 Security" },
    { icon: BarChart3, title: "Bandwidth Reports", description: "Track network usage patterns", tier: "basic", category: "📊 Reports" },
    { icon: Lock, title: "Advanced Threat Detection", description: "AI-powered security threat analysis", tier: "premium", category: "🛡️ Advanced Security" },
    { icon: Globe, title: "VPN Integration", description: "Secure remote access support", tier: "premium", category: "🌐 Remote Access" },
    { icon: TrendingUp, title: "Productivity Insights", description: "Analyze employee network usage patterns", tier: "premium", category: "📈 Productivity" },
    { icon: MapPin, title: "Multi-Location Management", description: "Manage multiple office locations", tier: "premium", category: "🏢 Multi-Office" },
    { icon: FileText, title: "Compliance Reporting", description: "Generate compliance and audit reports", tier: "enterprise", category: "📋 Compliance" },
    { icon: UserCheck, title: "24/7 Enterprise Support", description: "Dedicated support team", tier: "enterprise", category: "🆘 Support" },
  ]
};

const tierPricing = {
  home: { basic: "Free", premium: "KES 300/month" },
  school: { basic: "Free", premium: "KES 1,500/month" },
  work: { basic: "Free", premium: "KES 3,000/month" }
};

export const PremiumFeatures = () => {
  const { subscriptionTier, isPremium, planType, upgradeSubscription, isLoading } = useSubscription();

  const tierLevels = {
    free: 0,
    basic: 1,
    premium: 2,
    enterprise: 3
  };

  const currentFeatures = planFeatures[planType] || planFeatures.home;
  const pricing = tierPricing[planType] || tierPricing.home;

  const handleUpgrade = async () => {
    await upgradeSubscription('premium');
  };

  const handleDemo = () => {
    localStorage.setItem('demo-premium', 'true');
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <Card className={`${isPremium ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-800' : ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className={`h-5 w-5 ${isPremium ? 'text-amber-600' : 'text-muted-foreground'}`} />
              <CardTitle className="capitalize">{planType} Plan Features</CardTitle>
              {isPremium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  Premium Active
                </Badge>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current Tier</p>
              <p className="font-semibold capitalize">{subscriptionTier}</p>
            </div>
          </div>
          <CardDescription>
            {isPremium 
              ? `You have access to all premium features for your ${planType} plan`
              : `Unlock advanced features for your ${planType} network`
            }
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentFeatures.map((feature, index) => {
          const Icon = feature.icon;
          const hasAccess = tierLevels[subscriptionTier] >= tierLevels[feature.tier as keyof typeof tierLevels];
          
          return (
            <Card 
              key={index}
              className={`transition-all ${
                hasAccess 
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                  : feature.tier === 'premium' 
                    ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'
                    : 'border-border bg-muted/30'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    hasAccess 
                      ? 'bg-green-100 dark:bg-green-800' 
                      : feature.tier === 'premium'
                        ? 'bg-amber-100 dark:bg-amber-800'
                        : 'bg-muted'
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      hasAccess 
                        ? 'text-green-600 dark:text-green-400' 
                        : feature.tier === 'premium'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{feature.title}</h4>
                      <Badge 
                        variant={hasAccess ? "default" : "secondary"}
                        className={`text-xs capitalize ${
                          hasAccess 
                            ? 'bg-green-500' 
                            : feature.tier === 'premium' 
                              ? 'bg-amber-500 text-white'
                              : ''
                        }`}
                      >
                        {hasAccess ? 'Active' : feature.tier}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {feature.category}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pricing Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Basic Plan
              <Badge variant="secondary">{pricing.basic}</Badge>
            </CardTitle>
            <CardDescription>Essential network monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {currentFeatures.filter(f => f.tier === 'basic').map((feature, i) => (
                <li key={i} className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  {feature.title}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="border-2 border-amber-300 relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <Crown className="text-amber-500" size={20} />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Premium Plan
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">
                {pricing.premium}
              </Badge>
            </CardTitle>
            <CardDescription>Everything in Basic, plus advanced features</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm mb-4">
              {currentFeatures.filter(f => f.tier === 'premium').slice(0, 3).map((feature, i) => (
                <li key={i} className="flex items-center">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mr-2" />
                  {feature.title}
                </li>
              ))}
              {currentFeatures.filter(f => f.tier === 'premium').length > 3 && (
                <li className="text-muted-foreground">
                  + {currentFeatures.filter(f => f.tier === 'premium').length - 3} more features
                </li>
              )}
            </ul>
            
            {!isPremium && (
              <div className="space-y-2">
                <Button 
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  <Crown className="mr-2 h-4 w-4" />
                  {isLoading ? 'Upgrading...' : 'Upgrade Now'}
                </Button>
                <Button 
                  onClick={handleDemo}
                  variant="outline" 
                  className="w-full border-amber-300 text-amber-600 hover:bg-amber-50"
                >
                  Try Demo Mode
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feature Access Note */}
      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <BarChart3 className="text-blue-600 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Realistic Usage Limits
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                Example: If your {planType} plan supports 10 devices, you'll receive warnings when 11+ devices 
                are detected, along with suggestions to upgrade your plan or optimize your network.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};