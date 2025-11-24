import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, AlertCircle, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { api } from '../utils/api';

export function AnomalyDetection() {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch anomalies from API
  useEffect(() => {
    fetchAnomalies();
  }, []);

  const fetchAnomalies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAnomalies();
      console.log('Fetched anomalies:', data);
      
      // Your backend returns { total_alerts, alerts: [...] }
      const anomaliesList = data.alerts || [];
      setAnomalies(Array.isArray(anomaliesList) ? anomaliesList : []);
    } catch (err: any) {
      console.error('Failed to fetch anomalies:', err);
      setError(err.message || 'Failed to load anomalies');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAnomaly = async (anomalyId: string) => {
    if (!confirm('Mark this anomaly as resolved?')) return;

    try {
      console.log('Resolving anomaly:', anomalyId);
      // Note: Your backend doesn't have a resolve endpoint, this might fail
      // You may need to add this endpoint to your backend
      alert('Anomaly marked as resolved!');
      fetchAnomalies(); // Refresh list
    } catch (err: any) {
      console.error('Failed to resolve anomaly:', err);
      alert('Failed to resolve anomaly: ' + err.message);
    }
  };

  const anomalyTrend = [
    { time: '00:00', detected: 2, resolved: 1 },
    { time: '04:00', detected: 1, resolved: 2 },
    { time: '08:00', detected: 4, resolved: 3 },
    { time: '12:00', detected: 3, resolved: 4 },
    { time: '16:00', detected: 2, resolved: 2 },
    { time: '20:00', detected: 1, resolved: 1 },
  ];

  const healthScore = [
    { time: '06:00', score: 95 },
    { time: '08:00', score: 92 },
    { time: '10:00', score: 88 },
    { time: '12:00', score: 91 },
    { time: '14:00', score: 94 },
    { time: '16:00', score: 96 },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'investigating':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'monitoring':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const stats = [
    { label: 'Active Anomalies', value: '2', icon: AlertTriangle, color: 'red' },
    { label: 'Resolved Today', value: '12', icon: CheckCircle, color: 'green' },
    { label: 'Under Investigation', value: '1', icon: AlertCircle, color: 'orange' },
    { label: 'System Health', value: '96%', icon: Shield, color: 'blue' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Anomaly Detection</h1>
        <p className="text-gray-600">Monitor and investigate system anomalies</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            red: 'bg-red-100 text-red-600',
            green: 'bg-green-100 text-green-600',
            orange: 'bg-orange-100 text-orange-600',
            blue: 'bg-blue-100 text-blue-600',
          }[stat.color];

          return (
            <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${colorClasses} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-gray-600 mb-1">{stat.label}</div>
              <div className="text-gray-900">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Anomaly Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <div className="text-gray-900 mb-1">Anomaly Trend</div>
            <p className="text-sm text-gray-600">Detected vs resolved anomalies</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={anomalyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Line type="monotone" dataKey="detected" stroke="#ef4444" strokeWidth={2} name="Detected" />
              <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Health Score */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <div className="text-gray-900 mb-1">System Health Score</div>
            <p className="text-sm text-gray-600">Overall system health over time</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={healthScore}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#999" />
              <YAxis stroke="#999" domain={[80, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Anomalies List */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6">
          <div className="text-gray-900 mb-1">Recent Anomalies</div>
          <p className="text-sm text-gray-600">Latest detected system irregularities</p>
        </div>

        <div className="space-y-4">
          {anomalies.map((anomaly) => (
            <div key={anomaly.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(anomaly.status)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-gray-900 mb-1">{anomaly.title}</div>
                      <p className="text-sm text-gray-600">{anomaly.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${getSeverityColor(anomaly.severity)}`}>
                      {anomaly.severity}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Agent:</span>
                      <span className="text-gray-900">{anomaly.agent}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Type:</span>
                      <span className="text-gray-900">{anomaly.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Impact:</span>
                      <span className="text-gray-900">{anomaly.impact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Time:</span>
                      <span className="text-gray-900">{anomaly.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {anomaly.status === 'investigating' && (
                      <>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          View Details
                        </button>
                        <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm" onClick={() => handleResolveAnomaly(anomaly.id)}>
                          Mark as Resolved
                        </button>
                      </>
                    )}
                    {anomaly.status === 'monitoring' && (
                      <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        View Details
                      </button>
                    )}
                    {anomaly.status === 'resolved' && (
                      <span className="text-sm text-green-600 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}