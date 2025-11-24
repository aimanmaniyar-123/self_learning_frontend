import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import {
  Bot,
  Activity,
  Target,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  RefreshCw,
  PlayCircle,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Gauge,
  Clock,
  History,
} from 'lucide-react';

interface DashboardProps {
  currentPage: string;
}

export function Dashboard({ currentPage }: DashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [agents, setAgents] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [goalsSummary, setGoalsSummary] = useState<any | null>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        agentsRes,
        sessionsRes,
        metricsRes,
        goalsSummaryRes,
        goalsRes,
        anomaliesRes,
      ] = await Promise.all([
        api.getAgents().catch(() => []),
        api.getTrainingSessions().catch(() => []),
        api.getPerformanceMetrics().catch(() => null),
        api.getGoalsSummary().catch(() => null),
        api.getGoals().catch(() => []),
        api.getAnomalies().catch(() => []),
      ]);

      setAgents(Array.isArray(agentsRes) ? agentsRes : []);
      setSessions(Array.isArray(sessionsRes) ? sessionsRes : []);
      setMetrics(metricsRes);
      setGoalsSummary(goalsSummaryRes);
      setGoals(Array.isArray(goalsRes) ? goalsRes : []);
      setAnomalies(Array.isArray(anomaliesRes) ? anomaliesRes : []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (currentPage === 'dashboard') {
      loadData();
    }
  }, [currentPage]);

  const manualRefresh = () => {
    loadData();
  };

  // ===== Derived stats =====
  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.status === 'active').length;
  const pausedAgents = agents.filter((a) => a.status !== 'active').length;
  const weakAgents = agents.filter((a) => (a.accuracy || 0) < 93).length;

  const totalSessions = sessions.length;
  const inProgressSessions = sessions.filter(
    (s) => s.status === 'in_progress'
  ).length;

  const openAnomalies = anomalies.filter(
    (a) => a.status && a.status !== 'resolved'
  );
  const activeAnomalies = openAnomalies.length;
  const investigatingAnomalies = anomalies.filter(
    (a) => a.status === 'investigating'
  ).length;

  // resolved today
  const todayStr = new Date().toISOString().slice(0, 10);
  const resolvedToday = anomalies.filter((a) => {
    if (a.status !== 'resolved') return false;
    const ts = a.timestamp || a.resolved_at || a.updated_at;
    if (!ts) return false;
    return String(ts).slice(0, 10) === todayStr;
  }).length;

  // ===== System metrics (small stat cards) =====
  const accuracyHistory: { timestamp: string; value: number }[] =
    (metrics && metrics.accuracy) || [];
  const lastAccuracy =
    accuracyHistory.length > 0
      ? accuracyHistory[accuracyHistory.length - 1].value
      : 96;

  const latencyHistory: { timestamp: string; value: number }[] =
    (metrics && (metrics.latency_ms || metrics.latency)) || [];
  const lastLatency =
    latencyHistory.length > 0
      ? latencyHistory[latencyHistory.length - 1].value
      : 120;

  const stabilityHistory: { timestamp: string; value: number }[] =
    (metrics && metrics.stability) || [];
  const lastStability =
    stabilityHistory.length > 0
      ? stabilityHistory[stabilityHistory.length - 1].value
      : 97;

  const efficiencyHistory: { timestamp: string; value: number }[] =
    (metrics && metrics.efficiency) || [];
  const lastEfficiency =
    efficiencyHistory.length > 0
      ? efficiencyHistory[efficiencyHistory.length - 1].value
      : 88;

  const systemHealth = Math.round(lastAccuracy);
  const activeGoals = goalsSummary?.active_goals ?? 0;

  const recentSessions = [...sessions]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 5);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">AI Ops Dashboard</h1>
          <p className="text-gray-600">
            Real-time view of anomalies, agents, training and system metrics.
          </p>
        </div>

        <button
          onClick={manualRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 mb-4">
          {error}
        </div>
      )}

      {/* ===== Row 1: Anomaly overview (like your image 1) ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Active Anomalies */}
        <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <div className="text-sm text-gray-700">Active Anomalies</div>
            <div className="text-lg font-semibold text-gray-900">
              {activeAnomalies}
            </div>
          </div>
        </div>

        {/* Resolved Today */}
        <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <div className="text-sm text-gray-700">Resolved Today</div>
            <div className="text-lg font-semibold text-gray-900">
              {resolvedToday}
            </div>
          </div>
        </div>

        {/* Under Investigation */}
        <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <div className="text-sm text-gray-700">Under Investigation</div>
            <div className="text-lg font-semibold text-gray-900">
              {investigatingAnomalies}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <div className="text-sm text-gray-700">System Health</div>
            <div className="text-lg font-semibold text-gray-900">
              {systemHealth}%
            </div>
          </div>
        </div>
      </div>

      {/* ===== Row 2: Agents + Training summary (your Option C) ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Agents */}
        <div className="bg-white p-4 rounded-lg border flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Agents</p>
            <p className="text-lg font-semibold text-gray-900">
              {totalAgents}
            </p>
            <p className="text-[11px] text-gray-500">
              {activeAgents} active · {pausedAgents} paused · {weakAgents} weak
            </p>
          </div>
        </div>

        {/* Training */}
        <div className="bg-white p-4 rounded-lg border flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Training</p>
            <p className="text-lg font-semibold text-gray-900">
              {inProgressSessions} running
            </p>
            <p className="text-[11px] text-gray-500">
              {totalSessions} total sessions
            </p>
          </div>
        </div>
      </div>

      {/* ===== Row 3: System metrics as 4 colored stat cards (Option B + colored icons) ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Accuracy */}
        <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="text-xs text-gray-500">System Accuracy</div>
            <div className="text-lg font-semibold text-gray-900">
              {lastAccuracy?.toFixed ? lastAccuracy.toFixed(2) : lastAccuracy}%
            </div>
          </div>
        </div>

        {/* Latency */}
        <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Avg Latency</div>
            <div className="text-lg font-semibold text-gray-900">
              {lastLatency?.toFixed ? lastLatency.toFixed(0) : lastLatency} ms
            </div>
          </div>
        </div>

        {/* Stability */}
        <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Stability</div>
            <div className="text-lg font-semibold text-gray-900">
              {lastStability?.toFixed
                ? lastStability.toFixed(2)
                : lastStability}
              %
            </div>
          </div>
        </div>

        {/* Efficiency */}
        <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Gauge className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Efficiency</div>
            <div className="text-lg font-semibold text-gray-900">
              {lastEfficiency?.toFixed
                ? lastEfficiency.toFixed(2)
                : lastEfficiency}
              %
            </div>
          </div>
        </div>
      </div>

      {/* ===== Bottom row: Top agents / recent training / latest anomalies ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Top Agents */}
        <div className="bg-white p-5 rounded-lg border">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <h2 className="text-gray-900 text-sm font-medium">Top Agents</h2>
          </div>
          {agents.length === 0 ? (
            <p className="text-xs text-gray-500">No agents available.</p>
          ) : (
            <div className="space-y-3 text-xs">
              {[...agents]
                .sort(
                  (a, b) => (b.accuracy || 0) - (a.accuracy || 0)
                )
                .slice(0, 5)
                .map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                  >
                    <div>
                      <div className="text-gray-900 text-sm">{a.name}</div>
                      <div className="text-[11px] text-gray-500">
                        {a.agent_type} · {a.tasks} tasks
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {a.accuracy?.toFixed
                          ? a.accuracy.toFixed(1)
                          : a.accuracy}
                        %
                      </div>
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1">
                        <div
                          className="h-1.5 bg-blue-500 rounded-full"
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(100, a.accuracy || 0)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Recent training */}
        <div className="bg-white p-5 rounded-lg border">
          <div className="flex items-center gap-2 mb-3">
            <PlayCircle className="w-4 h-4 text-purple-600" />
            <h2 className="text-gray-900 text-sm font-medium">
              Recent Training
            </h2>
          </div>
          {recentSessions.length === 0 ? (
            <p className="text-xs text-gray-500">No sessions yet.</p>
          ) : (
            <div className="space-y-3 text-xs">
              {recentSessions.map((s) => (
                <div
                  key={s.id}
                  className="p-2 rounded-lg bg-gray-50 flex items-center justify-between"
                >
                  <div>
                    <div className="text-gray-900 text-sm">
                      Agent: {s.agent}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {new Date(s.timestamp).toLocaleString()} · {s.duration}{' '}
                      epochs
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] ${
                      s.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : s.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest anomalies list */}
        <div className="bg-white p-5 rounded-lg border">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-red-600" />
            <h2 className="text-gray-900 text-sm font-medium">
              Latest Anomalies
            </h2>
          </div>
          {anomalies.length === 0 ? (
            <p className="text-xs text-gray-500">No anomalies detected.</p>
          ) : (
            <div className="space-y-3 text-xs max-h-64 overflow-auto">
              {anomalies.slice(0, 6).map((a) => (
                <div
                  key={a.id}
                  className="p-2 rounded-lg bg-gray-50 flex items-start justify-between"
                >
                  <div>
                    <div className="text-gray-900 text-sm">
                      {a.title || a.id}
                    </div>
                    {a.description && (
                      <div className="text-[11px] text-gray-500 mb-1">
                        {a.description}
                      </div>
                    )}
                    <div className="text-[11px] text-gray-400">
                      {new Date(a.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] block mb-1 ${
                        a.status === 'resolved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {a.status}
                    </span>
                    {a.severity && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-orange-100 text-orange-700">
                        {a.severity}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
