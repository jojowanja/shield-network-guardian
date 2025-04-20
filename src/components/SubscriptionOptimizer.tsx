
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStatsSubscription } from "@/hooks/useStatsSubscription";
import { useToast } from "@/hooks/use-toast";

const plans = [
  { name: "Basic", speed: 10, price: 30, recommended: false },
  { name: "Standard", speed: 25, price: 45, recommended: true },
  { name: "Premium", speed: 50, price: 60, recommended: false },
  { name: "Ultimate", speed: 100, price: 85, recommended: false },
];

export const SubscriptionOptimizer = () => {
  const [selectedPlan, setSelectedPlan] = useState("Standard");
  const { stats } = useStatsSubscription();
  const { toast } = useToast();
  
  const handlePlanChange = (plan: string) => {
    setSelectedPlan(plan);
    toast({
      title: "Plan selected",
      description: `You've selected the ${plan} plan.`,
    });
  };
  
  const usageData = [
    { day: "Mon", usage: stats.mondayUsage },
    { day: "Tue", usage: stats.tuesdayUsage },
    { day: "Wed", usage: stats.wednesdayUsage },
    { day: "Thu", usage: stats.thursdayUsage },
    { day: "Fri", usage: stats.fridayUsage },
    { day: "Sat", usage: stats.saturdayUsage },
    { day: "Sun", usage: stats.sundayUsage },
  ];
  
  // Calculate if current plan is optimal based on usage
  const currentSpeed = 25; // Mbps - simulated current plan
  const maxUsage = Math.max(...usageData.map(d => d.usage));
  const utilizationPercentage = (maxUsage / currentSpeed) * 100;
  const needsUpgrade = utilizationPercentage > 90;
  const underutilized = utilizationPercentage < 50;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Optimizer</CardTitle>
        <CardDescription>Find the right plan for your usage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-72">
          <ChartContainer 
            config={{
              usage: { label: "Usage", color: "#0ea5e9" },
              limit: { label: "Plan Limit", color: "#ef4444" }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis 
                  label={{ value: 'Mbps', angle: -90, position: 'insideLeft' }} 
                  width={40}
                />
                <Tooltip 
                  content={(props) => {
                    if (props.active && props.payload && props.payload.length) {
                      return (
                        <ChartTooltipContent
                          className="border border-muted bg-popover p-2 text-popover-foreground shadow-md"
                          content={
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs uppercase text-muted-foreground">Usage</span>
                              <span className="font-bold">{props.payload[0].value} Mbps</span>
                            </div>
                          }
                        />
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="usage" fill="var(--color-usage)" radius={[4, 4, 0, 0]} />
                <ChartTooltip />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {needsUpgrade && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-400">
            <p className="font-medium">You've exceeded 90% of your plan capacity several times this week.</p>
            <p className="text-sm mt-1">Consider upgrading your plan for better performance.</p>
          </div>
        )}
        
        {underutilized && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-400">
            <p className="font-medium">You're using less than 50% of your plan capacity.</p>
            <p className="text-sm mt-1">You might save money with a lower-tier plan.</p>
          </div>
        )}
        
        <div>
          <h3 className="mb-3 font-semibold">Available Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={`flex flex-col border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPlan === plan.name 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                } ${plan.recommended ? "ring-2 ring-primary ring-offset-2" : ""}`}
                onClick={() => handlePlanChange(plan.name)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{plan.name}</h4>
                  {plan.recommended && (
                    <span className="text-xs font-medium rounded-full px-2 py-0.5 bg-primary text-primary-foreground">
                      Recommended
                    </span>
                  )}
                </div>
                <span className="text-2xl font-bold">${plan.price}</span>
                <span className="text-sm text-muted-foreground">per month</span>
                <div className="mt-2 text-sm">{plan.speed} Mbps</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button className="flex items-center space-x-2">
            <span>Upgrade Plan</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
