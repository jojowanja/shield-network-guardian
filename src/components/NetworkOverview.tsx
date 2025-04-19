import { useEffect } from 'react';
import { useDeviceSubscription } from '@/hooks/useDeviceSubscription';
import { useStatsSubscription } from '@/hooks/useStatsSubscription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNetworkStats } from "@/hooks/useNetworkStats";

export const NetworkOverview = () => {
  useDeviceSubscription();
  useStatsSubscription();
  const { networkHistory } = useNetworkStats();

  const latestStats = networkHistory && networkHistory.length > 0 ? networkHistory[0] : null;

  const data = networkHistory ? networkHistory.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    download: item.downloadSpeed,
    upload: item.uploadSpeed,
  })).reverse() : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Network Overview</CardTitle>
          <CardDescription>Real-time insights into your network</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Download Speed"
            value={latestStats ? `${latestStats.downloadSpeed.toFixed(1)} Mbps` : "N/A"}
            trend={latestStats ? latestStats.downloadSpeed - (networkHistory && networkHistory.length > 1 ? networkHistory[1].downloadSpeed : 0) : 0}
          />
          <MetricCard
            title="Upload Speed"
            value={latestStats ? `${latestStats.uploadSpeed.toFixed(1)} Mbps` : "N/A"}
            trend={latestStats ? latestStats.uploadSpeed - (networkHistory && networkHistory.length > 1 ? networkHistory[1].uploadSpeed : 0) : 0}
          />
          <MetricCard
            title="Ping"
            value={latestStats ? `${latestStats.ping.toFixed(0)} ms` : "N/A"}
            trend={latestStats ? latestStats.ping - (networkHistory && networkHistory.length > 1 ? networkHistory[1].ping : 0) : 0}
          />
          <MetricCard
            title="Stability"
            value={latestStats ? `${latestStats.stability.toFixed(1)}%` : "N/A"}
            trend={latestStats ? latestStats.stability - (networkHistory && networkHistory.length > 1 ? networkHistory[1].stability : 0) : 0}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Network Speed History</CardTitle>
          <CardDescription>Download and upload speeds over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="download" stroke="#8884d8" fill="#8884d8" name="Download (Mbps)" />
              <Area type="monotone" dataKey="upload" stroke="#82ca9d" fill="#82ca9d" name="Upload (Mbps)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
