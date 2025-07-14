import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { 
  Home, 
  School, 
  Building2, 
  Users, 
  Shield, 
  Wifi, 
  BarChart3, 
  Clock,
  BookOpen,
  Briefcase,
  Filter,
  TrendingUp,
  UserCheck,
  AlertTriangle,
  Smartphone,
  Router
} from "lucide-react";

export function PlanDashboard() {
  const { planType, isPremium } = useSubscription();

  const planContent = {
    home: {
      icon: Home,
      title: "Home Network Guardian",
      description: "Protect your family's digital life",
      stats: [
        { label: "Connected Devices", value: "12", icon: Smartphone },
        { label: "Family Members", value: "4", icon: Users },
        { label: "Security Score", value: "92%", icon: Shield },
        { label: "Network Speed", value: "85 Mbps", icon: Wifi }
      ],
      features: {
        basic: [
          "Device management for family members",
          "Parental controls and screen time",
          "Basic security monitoring",
          "Speed testing and optimization"
        ],
        premium: [
          "Smart guest WiFi for visitors",
          "AI-powered threat detection",
          "Automatic device prioritization",
          "Family usage analytics",
          "IoT device security scanning"
        ]
      },
      activities: [
        "Kids' tablets connected at 3:30 PM",
        "Smart TV streaming optimized",
        "Guest WiFi created for visitors",
        "Security scan completed - all clear"
      ]
    },
    school: {
      icon: School,
      title: "School Network Manager",
      description: "Secure and optimize educational environments",
      stats: [
        { label: "Student Devices", value: "250", icon: BookOpen },
        { label: "Classrooms", value: "15", icon: School },
        { label: "Content Filtered", value: "99.8%", icon: Filter },
        { label: "Uptime", value: "99.9%", icon: Clock }
      ],
      features: {
        basic: [
          "Basic device monitoring",
          "Simple content filtering",
          "Network usage reports",
          "Student device registration"
        ],
        premium: [
          "Advanced content filtering by age group",
          "Classroom network segmentation",
          "Student productivity analytics",
          "Automatic blocking of inappropriate content",
          "Real-time monitoring dashboard"
        ]
      },
      activities: [
        "Math class tablets connected (Room 205)",
        "Social media blocked during study hours",
        "New teacher device registered",
        "Content filter updated for grade levels"
      ]
    },
    work: {
      icon: Building2,
      title: "Enterprise Network Security",
      description: "Professional-grade network protection",
      stats: [
        { label: "Employee Devices", value: "89", icon: Briefcase },
        { label: "Security Incidents", value: "0", icon: AlertTriangle },
        { label: "Compliance Score", value: "100%", icon: UserCheck },
        { label: "Productivity Index", value: "94%", icon: TrendingUp }
      ],
      features: {
        basic: [
          "Employee device tracking",
          "Basic security monitoring",
          "Bandwidth usage reports",
          "Network access logs"
        ],
        premium: [
          "Advanced threat detection and response",
          "VPN integration and monitoring",
          "Compliance reporting (GDPR, HIPAA)",
          "Employee productivity insights",
          "Zero-trust security implementation"
        ]
      },
      activities: [
        "VPN connection secured for remote worker",
        "Threat blocked: suspicious download attempt",
        "Compliance report generated",
        "New employee device onboarded"
      ]
    }
  };

  const currentPlan = planContent[planType];
  const PlanIcon = currentPlan.icon;

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <PlanIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{currentPlan.title}</CardTitle>
                <CardDescription>{currentPlan.description}</CardDescription>
              </div>
            </div>
            <Badge variant={isPremium ? "default" : "secondary"}>
              {isPremium ? "Premium" : "Basic"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Plan Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {currentPlan.stats.map((stat, index) => {
          const StatIcon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <StatIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features Available */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Current Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {currentPlan.features.basic.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>{isPremium ? "Premium Features" : "Upgrade to Premium"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {currentPlan.features.premium.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isPremium ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  <span className={`text-sm ${!isPremium ? 'text-muted-foreground' : ''}`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            {!isPremium && (
              <Button className="w-full mt-4" variant="outline">
                Upgrade to Premium
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentPlan.activities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm">{activity}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {index === 0 ? "Just now" : `${index * 15} minutes ago`}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}