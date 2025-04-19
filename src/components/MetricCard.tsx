
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  trend: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trend >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
          {trend >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
          {Math.abs(trend).toFixed(1)}% 
          {trend >= 0 ? 'increase' : 'decrease'}
        </p>
      </CardContent>
    </Card>
  );
};
