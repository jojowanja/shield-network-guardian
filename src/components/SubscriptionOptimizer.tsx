
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Plan {
  id: string;
  provider: string;
  name: string;
  speed: number;
  price: number;
  dataCap?: number;
}

const availablePlans: Plan[] = [
  { id: "safaricom-basic", provider: "Safaricom", name: "Basic", speed: 10, price: 2999 },
  { id: "safaricom-standard", provider: "Safaricom", name: "Standard", speed: 20, price: 3999 },
  { id: "safaricom-premium", provider: "Safaricom", name: "Premium", speed: 40, price: 5999 },
  { id: "zuku-starter", provider: "Zuku", name: "Starter", speed: 10, price: 2499, dataCap: 500 },
  { id: "zuku-rapid", provider: "Zuku", name: "Rapid", speed: 30, price: 3999 },
  { id: "zuku-fast", provider: "Zuku", name: "Fast", speed: 50, price: 4999 },
  { id: "jamii-basic", provider: "Jamii", name: "Basic", speed: 5, price: 1499, dataCap: 200 },
  { id: "jamii-plus", provider: "Jamii", name: "Plus", speed: 15, price: 2499 },
  { id: "jamii-pro", provider: "Jamii", name: "Pro", speed: 25, price: 3499 },
];

// Sample usage data for the last 30 days
const generateRandomUsageData = () => {
  return Array(30).fill(null).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    
    return {
      date: date.toLocaleDateString(),
      usage: Math.floor(Math.random() * 30) + 10, // 10-40 Mbps
    };
  });
};

export const SubscriptionOptimizer = () => {
  const [currentPlanId, setCurrentPlanId] = useState<string>("");
  const [customSpeed, setCustomSpeed] = useState<string>("");
  const [customPrice, setCustomPrice] = useState<string>("");
  const isMobile = useIsMobile();
  
  const usageData = generateRandomUsageData();
  const currentPlan = availablePlans.find(plan => plan.id === currentPlanId);
  
  // Calculate max usage and how many times it exceeded the plan
  const maxUsage = Math.max(...usageData.map(day => day.usage));
  
  // Count days exceeding 90% of plan speed
  const daysExceeding = currentPlan
    ? usageData.filter(day => day.usage > currentPlan.speed * 0.9).length
    : 0;
  
  // Find recommended plan
  const getRecommendedPlan = () => {
    if (!currentPlan) return null;
    
    const recommendedSpeed = maxUsage * 1.2; // 20% overhead
    
    return availablePlans
      .filter(plan => plan.speed >= recommendedSpeed && plan.id !== currentPlanId)
      .sort((a, b) => a.price - b.price)[0];
  };
  
  const recommendedPlan = getRecommendedPlan();
  
  // Calculate usage percentage of current plan
  const usagePercentage = currentPlan ? (maxUsage / currentPlan.speed) * 100 : 0;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Subscription Optimizer</CardTitle>
        <CardDescription>
          Monitor your internet usage and find the best plan for your needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Select your current ISP plan</Label>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={currentPlanId} onValueChange={setCurrentPlanId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your plan" />
              </SelectTrigger>
              <SelectContent>
                {availablePlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.provider} - {plan.name} ({plan.speed} Mbps)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <p className="text-sm text-muted-foreground mt-2 sm:mt-0 sm:pt-2">or</p>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="custom-speed" className="text-xs">Speed (Mbps)</Label>
                <Input 
                  id="custom-speed" 
                  placeholder="e.g., 20" 
                  value={customSpeed}
                  onChange={(e) => setCustomSpeed(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="custom-price" className="text-xs">Price</Label>
                <Input 
                  id="custom-price" 
                  placeholder="e.g., 2999" 
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        {(currentPlan || (customSpeed && customPrice)) && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Maximum Usage:</span>
                <span className="font-medium">{maxUsage} Mbps</span>
              </div>
              <Progress 
                value={usagePercentage} 
                className={usagePercentage > 90 ? "bg-red-500" : "bg-green-500"}
                max={100}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 Mbps</span>
                <span>{currentPlan ? currentPlan.speed : customSpeed} Mbps</span>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={usageData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis 
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    label={{ value: 'Mbps', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="usage" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#usageGradient)" 
                    name="Usage (Mbps)" 
                  />
                  {currentPlan && (
                    <Area
                      type="monotone"
                      dataKey={() => currentPlan.speed * 0.9}
                      stroke="#ff0000"
                      strokeDasharray="5 5"
                      fill="none"
                      name="90% Plan Capacity"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {daysExceeding > 5 && recommendedPlan && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2">
                  Upgrade Recommendation
                </h4>
                <p className="text-sm mb-3">
                  You've exceeded 90% of your plan capacity {daysExceeding} times in the last month. 
                  Consider upgrading to a faster plan.
                </p>
                <div className="flex items-center justify-between bg-white dark:bg-black/20 p-3 rounded-md">
                  <div>
                    <p className="text-sm font-medium">
                      {currentPlan?.provider || 'Current'} - {currentPlan?.name || 'Plan'} 
                      ({currentPlan?.speed || customSpeed} Mbps)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      KES {currentPlan?.price || customPrice}/month
                    </p>
                  </div>
                  <ArrowRight size={18} className="mx-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {recommendedPlan.provider} - {recommendedPlan.name} ({recommendedPlan.speed} Mbps)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      KES {recommendedPlan.price}/month
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700">
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            )}
            
            {daysExceeding <= 5 && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-300">
                  Your current plan is well-suited for your usage
                </h4>
                <p className="text-sm mt-1">
                  Based on your usage patterns, your current plan seems sufficient. 
                  Continue monitoring for any changes in your needs.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
