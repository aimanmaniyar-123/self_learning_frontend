import { useState, useEffect } from 'react';
import { Activity, BarChart3, Cpu, Timer, Users, Gauge } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../utils/api';

export function Performance() {
  const [metrics, setMetrics] = useState<any>(null);
  const [system, setSystem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [metricRes, systemRes] = await Promise.all([
        api.getPerformanceMetrics(),
        api.getSystemPerformance()
      ]);

      setMetrics(metricRes);
      setSystem(systemRes);
    } catch (err: any) {
      console.error('Failed to load performance:', err);
      setError(err.message || 'Failed to load performance metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full mx-auto mb-4"></div>
        Loading performance data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg inline-block">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Performance</h1>
        <p className="text-gray-600">System metrics and trends</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={Users} label="Total Agents" value={system.total_agents} color="blue" />
        <StatCard icon={Activity} label="Active Agents" value={system.active_agents} color="green" />
        <StatCard icon={Gauge} label="Success Rate" value={`${system.overall_success_rate}%`} color="purple" />
        <StatCard icon={Timer} label="Avg Response" value={`${system.avg_response_time} ms`} color="orange" />
        <StatCard icon={Cpu} label="CPU Usage" value={`${system.cpu_usage}%`} color="red" />
        <StatCard icon={Cpu} label="Memory Usage" value={`${system.memory_usage}%`} color="yellow" />
        <StatCard icon={BarChart3} label="Queue Length" value={system.queue_length} color="gray" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Accuracy Trend (%)" data={metrics.accuracy} lineColor="#3b82f6" />
        <ChartCard title="Efficiency Trend (%)" data={metrics.efficiency} lineColor="#8b5cf6" />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  const colors: any = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    gray: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg">
      <div className={`w-12 h-12 ${colors[color]} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-gray-600 mb-1">{label}</div>
      <div className="text-gray-900 font-semibold">{value}</div>
    </div>
  );
}

function ChartCard({ title, data, lineColor }: any) {
  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg">
      <div className="text-gray-900 mb-1">{title}</div>
      <p className="text-sm text-gray-600 mb-4">Last 7 days</p>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="timestamp" tickFormatter={(t) => t.split("T")[0]} stroke="#999" />
          <YAxis stroke="#999" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
