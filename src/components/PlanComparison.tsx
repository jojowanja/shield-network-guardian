import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Star } from "lucide-react";

interface Feature {
  name: string;
  basic: boolean | string;
  premium: boolean | string;
  description?: string;
}

export function PlanComparison() {
  const features: Feature[] = [
    {
      name: "Device Monitoring",
      basic: "Up to 10 devices",
      premium: "Unlimited devices",
      description: "Real-time monitoring of all connected devices"
    },
    {
      name: "Speed Testing",
      basic: true,
      premium: true,
      description: "Network speed tests and performance monitoring"
    },
    {
      name: "Basic Security Alerts",
      basic: true,
      premium: true,
      description: "Get notified about basic security threats"
    },
    {
      name: "AI-Powered Optimization",
      basic: false,
      premium: true,
      description: "Smart network optimization based on usage patterns"
    },
    {
      name: "Guest WiFi Management",
      basic: false,
      premium: true,
      description: "Create temporary WiFi access for guests with auto-expiry"
    },
    {
      name: "Advanced Threat Detection",
      basic: false,
      premium: true,
      description: "Machine learning-based threat identification and blocking"
    },
    {
      name: "Auto-Device Disconnect",
      basic: false,
      premium: true,
      description: "Automatically disconnect suspicious or inactive devices"
    },
    {
      name: "Weekly Performance Reports",
      basic: false,
      premium: true,
      description: "Detailed email reports with optimization recommendations"
    },
    {
      name: "Router Upgrade Recommendations",
      basic: false,
      premium: true,
      description: "AI suggestions for hardware and ISP improvements"
    },
    {
      name: "Multi-Location Support",
      basic: false,
      premium: true,
      description: "Manage multiple networks from a single dashboard"
    },
    {
      name: "Priority Support",
      basic: "Community forum",
      premium: "24/7 Expert support",
      description: "Access to our technical support team"
    },
    {
      name: "Custom Themes",
      basic: "Basic theme",
      premium: "Premium themes + Dark mode",
      description: "Personalize your dashboard appearance"
    }
  ];

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-green-500" />
      ) : (
        <X className="h-5 w-5 text-red-500" />
      );
    }
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground">
          Compare features and find the perfect plan for your needs
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Basic Plan</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
              </div>
              <Badge variant="outline">Free</Badge>
            </div>
            <div className="text-3xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/month</span></div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Up to 10 devices</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Basic monitoring</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Speed testing</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Community support</span>
              </li>
            </ul>
            <Button className="w-full" variant="outline">
              Get Started Free
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>Premium Plan</span>
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                </CardTitle>
                <CardDescription>Full-featured network protection</CardDescription>
              </div>
              <Badge>Most Popular</Badge>
            </div>
            <div className="text-3xl font-bold">$9.99<span className="text-lg font-normal text-muted-foreground">/month</span></div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Unlimited devices</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">AI-powered optimization</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Advanced security</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">24/7 expert support</span>
              </li>
            </ul>
            <Button className="w-full">
              Start Premium Trial
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
          <CardDescription>See exactly what's included in each plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold">Basic</th>
                  <th className="text-center py-3 px-4 font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{feature.name}</div>
                        {feature.description && (
                          <div className="text-sm text-muted-foreground">{feature.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {renderFeatureValue(feature.basic)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {renderFeatureValue(feature.premium)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pricing for Different Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Plan-Specific Pricing</CardTitle>
          <CardDescription>Tailored pricing for different use cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <h4 className="font-semibold text-lg mb-2">Home Plan</h4>
              <div className="text-2xl font-bold mb-2">$9.99/month</div>
              <p className="text-sm text-muted-foreground mb-4">Perfect for families and personal use</p>
              <ul className="text-sm space-y-1">
                <li>• Family device management</li>
                <li>• Parental controls</li>
                <li>• Guest WiFi</li>
                <li>• Smart home optimization</li>
              </ul>
            </div>
            <div className="text-center p-6 rounded-lg bg-green-50 dark:bg-green-950/20">
              <h4 className="font-semibold text-lg mb-2">School Plan</h4>
              <div className="text-2xl font-bold mb-2">$49.99/month</div>
              <p className="text-sm text-muted-foreground mb-4">Designed for educational institutions</p>
              <ul className="text-sm space-y-1">
                <li>• Student device management</li>
                <li>• Content filtering</li>
                <li>• Classroom segmentation</li>
                <li>• Educational analytics</li>
              </ul>
            </div>
            <div className="text-center p-6 rounded-lg bg-purple-50 dark:bg-purple-950/20">
              <h4 className="font-semibold text-lg mb-2">Work Plan</h4>
              <div className="text-2xl font-bold mb-2">$99.99/month</div>
              <p className="text-sm text-muted-foreground mb-4">Enterprise-grade security</p>
              <ul className="text-sm space-y-1">
                <li>• Enterprise security</li>
                <li>• Compliance reporting</li>
                <li>• VPN integration</li>
                <li>• Advanced analytics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}